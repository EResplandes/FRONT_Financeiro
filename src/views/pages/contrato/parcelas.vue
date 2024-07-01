<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import ParcelaService from '../../../service/ParcelaService';
import { generatePDF } from '../relatorios/pdfGenerator.js';
import { useConfirm } from 'primevue/useconfirm';
import LinkService from '../../../service/LinkService';

export default {
    data() {
        return {
            toast: new useToast(),
            parcelaService: new ParcelaService(),
            linkService: new LinkService(),
            confirm: new useConfirm(),
            visibleRight: ref(false),
            visibleRightLink: ref(null),
            modal: ref(null),
            modalComprovante: ref(null),
            router: useRouter(),
            informacoes: ref(null),
            idPedido: ref(null),
            parcelas: ref(null),
            idEmpresa: ref(null),
            idParcela: ref(null),
            link: ref(null),
            empresas: ref(null),
            locais: ref(null),
            pdfsrc: ref(null),
            urlBase: 'https://contratos.gruporialma.com.br/storage',
            gerentes: ref(null),
            diretores: ref(null),
            id_contrato: localStorage.getItem('id_contrato'),
            form: ref({
                protheus: 999
            }),
            preloading: ref(true),
            loading: ref(false) // Botão de PDF
        };
    },

    mounted: function () {
        // Metódo responsável por buscar informações do contrato
        this.parcelaService.buscaInformacoes(this.id_contrato).then((data) => {
            this.informacoes = data.mensagem;
            this.preloading = false;
        });

        // Metódo responsável por buscar todas parcelas do contrato
        this.parcelaService.buscaParcelas(this.id_contrato).then((data) => {
            this.parcelas = data.response;
            this.preloading = false;
        });

        // Metódo responsável por buscar todos links disponíveis no link
        this.linkService.buscaPresidentes().then((data) => {
            this.link = data.funcionarios;
        });

        // Metódo responsável por buscar todas empresas cadastradas no link
        this.linkService.buscaEmpresas().then((data) => {
            this.empresas = data.empresas;
        });

        // Metódo responsável por buscar todos locais disponíves no link
        this.linkService.buscaLocais().then((data) => {
            this.locais = data.locais;
        });

        // Metódo responsável por buscar todos gerentes do link
        this.linkService.buscaGerentes().then((data) => {
            this.gerentes = data.funcionarios;
        });

        // Metódo responsável por buscar todos diretores do link
        this.linkService.buscaDiretores().then((data) => {
            this.diretores = data.funcionarios;
        });
    },

    methods: {
        // Metódo responsável por buscar parcelas
        buscaParcelas() {
            // Metódo responsável por buscar todas parcelas do contrato
            this.parcelaService.buscaParcelas(this.id_contrato).then((data) => {
                this.parcelas = data.response;
                this.preloading = false;
            });
        },

        // Metódo responsável por bvscar informações dos contratos
        buscaContrato() {
            this.parcelaService.buscaInformacoes(this.id_contrato).then((data) => {
                this.informacoes = data.mensagem;
                this.preloading = false;
            });
        },

        // Metódo responsável por cadastrar pedido
        cadastrarPedido() {
            this.linkService.comFluxo(this.form).then((data) => {
                if (data.resposta == 'Pedido cadastrado com sucesso!') {
                    this.showSuccess('Parcela enviada para o link com sucesso!');
                    this.idPedido = data.pedido;
                    this.statusLink();
                    this.visibleRightLink = false;
                    this.form = {};
                } else {
                    this.showError('Ocorreu algum erro, entre em contato com o Administrador!');
                }
            });
        },

        // Metódo responsável por atualizar status da parcela
        statusLink() {
            this.preloading = true;
            this.parcelaService.statusLink(this.idParcela, this.idPedido).then((data) => {
                if (data.resposta == 'Parcela enviada para o link com sucesso!') {
                    this.buscaParcelas();
                }
                this.preloading = false;
            });
        },

        // Metódo responsável por formatar cnpj
        formatarCNPJ(cnpj) {
            // Remove caracteres não numéricos
            cnpj = cnpj.replace(/\D/g, '');

            // Adiciona pontos e traços conforme necessário
            cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
            cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
            cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');

            return cnpj;
        },

        // Metódo responsável por formatar data para padrão br
        formatarDataParaBR(dataString) {
            // Converte a string em um objeto Date
            const data = new Date(dataString);

            // Obtém o dia, mês e ano da data
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();

            // Retorna a data formatada como "dia/mês/ano"
            return `${dia}/${mes}/${ano}`;
        },

        // Metódo responsável por cadastrar parcela
        cadastrarParcela() {
            this.parcelaService.cadastrarParcela(this.form).then((data) => {
                if (data.response == 'Parcela cadastrada com sucesso!') {
                    this.showSuccess('Parcela cadastrada com sucesso!');
                    this.buscaParcelas();
                    this.buscaContrato();
                    this.form = {};
                    this.visibleRight = false;
                } else {
                    for (const campo in data.errors) {
                        if (Object.hasOwnProperty.call(data.errors, campo)) {
                            const mensagensErro = data.errors[campo];
                            for (const mensagem of mensagensErro) {
                                this.showError(mensagem);
                            }
                        }
                    }
                }
            });
        },

        // Metódo responsável por buscar status no link de cada parcela
        buscaStatus(id) {
            this.linkService.buscaStatus(id).then((data) => {
                console.log(data[0].statusPedido);
                return data[0].statusPedido;
            });
        },

        // Metódo responsável por gerar pdf
        async gerarPDF() {
            this.loading = true;
            try {
                await generatePDF(this.informacoes, this.parcelas);
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                // Manipule o erro conforme necessário
            } finally {
                // Define a propriedade 'loading' como false após a conclusão do processo
                this.loading = false;
            }
        },

        btnEditar(id, info) {
            this.form.empresa = info.empresa;
            this.form.cnpj = info.cnpj;
            this.visibleRight = true;
            this.idEmpresa = id;
        },

        btnLink(idParcela, dados) {
            this.visibleRightLink = true;
            this.idParcela = idParcela;
            this.form.valor = dados.valor;
            console.log(dados);
        },

        btnCadastrar() {
            this.visibleRight = true;
        },

        btnExcluir(idParcela) {
            this.preloading = true;
            this.parcelaService.excluirParcela(idParcela).then((data) => {
                this.showSuccess('Parcela excluída com sucesso!');
                this.buscaParcelas();
                this.buscaContrato();
                this.preloading = false;
            });
        },

        btnComprovante(id) {
            this.modal = true;
            this.idParcela = id;
        },

        btnBuscaComprovante(comprovante) {
            this.modalComprovante = true;
            this.pdfsrc = `${this.urlBase}/${comprovante}`;
        },

        // Metódo responsável por anexar comprovante
        anexarComprovante() {
            this.preloading = true;
            this.parcelaService.anexaComprovante(this.form, this.idParcela).then((data) => {
                if (data.resposta == 'Comprovante anexado com sucesso!') {
                    this.showSuccess('Comprovante anexado com sucesso!');
                    this.modal = false;
                    this.buscaParcelas();
                } else {
                    this.showError('Ocorreu algum erro, entre em contato com o Administrador!');
                }
                this.preloading = false;
            });
        },

        confirmExcluir(idParcela) {
            this.confirm.require({
                message: 'Tem certeza que deseja excluir essa parcela?',
                header: 'Excluir Parcela?',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancelar',
                acceptLabel: 'Excluir',
                rejectClass: 'p-button-secondary p-button-outlined',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.btnExcluir(idParcela);
                },
                reject: () => {}
            });
        },

        showSuccess(mensagem) {
            this.toast.add({ severity: 'success', summary: 'Sucesso!', detail: mensagem, life: 3000 });
        },

        showInfo(mensagem) {
            this.toast.add({ severity: 'info', summary: 'Aviso!', detail: mensagem, life: 3000 });
        },

        showError(mensagem) {
            this.toast.add({ severity: 'error', summary: 'Ocorreu um erro!', detail: mensagem, life: 3000 });
        },

        // Metódo responsável por voltar para meenu de contrar
        voltar() {
            this.router.push('/contratos'); // Mandando para tela principal
        },

        uploadPdf() {
            this.form.pdf = this.$refs.pdf.files[0];
        },

        uploadPdfComprovante() {
            this.form.comprovante = this.$refs.pdfComprovante.files[0];
        }
    }
};
</script>

<template>
    <div class="grid">
        <div style="z-index: 99" v-if="preloading" class="full-screen-spinner">
            <ProgressSpinner />
        </div>

        <ConfirmDialog></ConfirmDialog>

        <!-- Modal para anexar comprovante -->
        <Dialog v-model:visible="modal" modal header="Anexo de Comprovante" :style="{ width: '50%' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Insira o comprovante referente a parcela.</span>
            <div class="flex items-center gap-4 mb-8">
                <label for="email" class="font-semibold w-24">Comprovante:</label>
                <FileUpload chooseLabel="Selecionar Arquivo" @change="uploadPdfComprovante" mode="basic" type="file" ref="pdfComprovante" name="demo[]" accept=".pdf,.docx" :maxFileSize="999999999"></FileUpload>
            </div>
            <div class="flex justify-end gap-2">
                <Button style="width: 50%" type="button" label="Cancelar" severity="secondary" @click="modal = false"></Button>
                <Button style="width: 50%" type="button" label="Anexar" severity="info" @click.prevent="anexarComprovante()"></Button>
            </div>
        </Dialog>

        <!-- Modal para visualizar comprovante -->
        <Dialog v-model:visible="modalComprovante" modal header="Comprovante" :style="{ width: '60%' }">
            <div class="flex items-center gap-4 mb-8">
                <iframe :src="pdfsrc" style="width: 100%; height: 700px; border: none"> Oops! ocorreu um erro. </iframe>
            </div>
        </Dialog>

        <!-- Modal de Cadastro de Parcelas -->
        <Sidebar style="width: 500px" v-model:visible="visibleRight" :baseZIndex="1000" position="right">
            <h3 class="titleForm">Formulário de Cadastro</h3>

            <div class="card p-fluid">
                <div class="field">
                    <label for="empresa">Mês de Referência: <span class="obrigatorio">*</span></label>
                    <InputText v-model="form.mes_referencia" id="cnpj" type="number" maxlength="2" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" />
                </div>
                <div class="field">
                    <label for="cpf">Data de Vencimento: <span class="obrigatorio">*</span></label>
                    <Calendar dateFormat="dd/mm/yy" :showIcon="true" :showButtonBar="true" v-model="form.dt_vencimento"></Calendar>
                </div>
                <div class="field">
                    <label for="cpf">Observação:</label>
                    <InputText v-model="form.observacao" id="cnpj" />
                </div>
                <div class="field">
                    <label for="cpf">Valor da Parcela: <span class="obrigatorio">*</span> <span class="txt-small">(Somente números!)</span></label>
                    <InputText v-model="form.valor_parcela" id="cnpj" type="number" />
                </div>
                <hr />
                <div class="field">
                    <Button @click.prevent="cadastrarParcela()" label="Cadastrar" class="mr-2 mb-2 p-button-info" />
                </div>
            </div>
        </Sidebar>

        <!-- Modal para enviar para o link -->
        <Sidebar style="width: 75%" v-model:visible="visibleRightLink" :baseZIndex="1000" position="right">
            <h3 class="titleForm">Formulário Link</h3>
            <div class="card p-fluid">
                <TabView :activeIndex="activeIndex">
                    <TabPanel header="Formulário">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-1 md:col-1">
                                <label for="firstname2">Urgente</label>
                                <InputSwitch :trueValue="1" :falseValue="0" :modelValue="form.urgente" v-model="form.urgente" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="firstname2">Valor <span class="obrigatorio">*</span></label>
                                <InputNumber v-tooltip.top="'Digite o valor do pedido'" v-model="form.valor" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="2" placeholder="R$..." />
                            </div>
                            <div class="field col-12 md:col-2">
                                <label for="firstname2">Nº Pedido no Protheus <span class="obrigatorio">* </span></label>
                                <InputText type="number" v-tooltip.top="'Digite o numero do pedido'" v-model="form.protheus" />
                            </div>

                            <div class="field col-12 md:col-2">
                                <label for="firstname2">Dt de Vencimento <span class="obrigatorio">*</span></label>
                                <Calendar dateFormat="dd/mm/yy" v-tooltip.top="'Selecione a data de vencimento'" v-model="form.dt_vencimento" showIcon iconDisplay="input" />
                            </div>

                            <div class="field col-1 md:col-3">
                                <label for="firstname2">PDF<span class="obrigatorio">*</span></label>
                                <FileUpload chooseLabel="Selecionar Arquivo" @change="uploadPdf" mode="basic" type="file" ref="pdf" name="demo[]" accept=".pdf,.docx" :maxFileSize="999999999"></FileUpload>
                            </div>

                            <div class="field col-12 md:col-4">
                                <label for="Link">Link <span class="obrigatorio">*</span></label>
                                <Dropdown id="Link" v-model="form.link" :options="link" optionLabel="nome" placeholder="Selecione..."></Dropdown>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="Empresa">Empresa <span class="obrigatorio">*</span></label>
                                <Dropdown id="Empresa" v-model="form.empresa" :options="empresas" optionLabel="nome_empresa" placeholder="Selecione..."></Dropdown>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="Local">Local <span class="obrigatorio">*</span></label>
                                <Dropdown id="Local" v-model="form.local" :options="locais" optionLabel="local" placeholder="Selecione..."></Dropdown>
                            </div>
                            <div class="field col-12">
                                <label for="descricao">Fornecedor: <span class="obrigatorio">*</span></label>
                                <Textarea v-tooltip.top="'Digite o forncedor'" id="descricao" rows="4" v-model="form.descricao" placeholder="Digite o fornecedor..." />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Fluxo" class="p-tabview-selected-secondary">
                        <div class="p-fluid formgrid grid">
                            <div class="field col-4 md:col-4">
                                <h6>GERENTES</h6>
                                <Listbox v-model="form.fluxo" :options="gerentes" multiple optionLabel="nome" class="w-full mt-4" />
                            </div>
                            <div class="field col-4 md:col-4">
                                <h6>DIRETORES</h6>
                                <Listbox v-model="form.fluxo" :options="diretores" multiple optionLabel="nome" class="w-full mt-4" />
                            </div>
                            <div class="field col-4 md:col-4">
                                <h6>FLUXO</h6>
                                <Listbox :options="form.fluxo" multiple optionLabel="nome" class="w-full mt-4" />
                            </div>
                            <div class="field col-12 md:col-12 mt-5">
                                <Button @click.prevent="cadastrarPedido()" icon="pi pi-check" label="Cadastrar Pedido" class="mr-2 mb-2 p-button-info" />
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </Sidebar>

        <div class="col-12">
            <h2 class="titleForm">Contrato nº {{ this.id_contrato }}</h2>
            <Button label="Voltar" @click.prevent="voltar()" class="p-button-secondary m-4" icon="pi pi-chevron-left"></Button>

            <div class="col-12 lg:col-6">
                <Toast />
            </div>
            <div v-for="item in informacoes" class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                    <div>
                        <div class="font-medium text-3xl text-900">{{ item.servico }} | <b>Unidade:</b> {{ item.unidade_consumidora }}</div>
                        <br /><br />
                        <div class="flex align-items-center text-700 flex-wrap">
                            <div class="mr-5 flex align-items-center mt-3">
                                <i class="pi pi-money-bill mr-2"></i>
                                <span><b>Valor:</b> {{ item.valor_contrato?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</span>
                            </div>
                            <div class="mr-5 flex align-items-center mt-3">
                                <i class="pi pi-sitemap mr-2"></i>
                                <span><b>Qtd. Parcelas:</b> {{ item.qtd_parcelas }}</span>
                            </div>
                            <div class="flex align-items-center mt-3 mr-4">
                                <i class="pi pi-building mr-2"></i>
                                <span><b>Empresa:</b> {{ item.nome_empresa }}</span>
                            </div>
                            <div class="flex align-items-center mt-3 mr-4">
                                <i class="pi pi-user mr-2"></i>
                                <span><b>Fornecedor:</b> {{ item.nome }}</span>
                            </div>
                            <div class="flex align-items-center mt-3 mr-4">
                                <i class="pi pi-id-card mr-2"></i>
                                <span><b>Nome Fantasia:</b> {{ item.nome_fantasia }}</span>
                            </div>
                            <div class="flex align-items-center mt-3">
                                <i class="pi pi-info mr-2"></i>
                                <span><b>CNPJ:</b> {{ formatarCNPJ(item.cnpj) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3 lg:mt-0">
                        <Button @click.prevent="gerarPDF()" :loading="loading" label="PDF" icon="pi pi-print" class="p-button-secondary"></Button>
                    </div>
                </div>
            </div>
            <br />

            <div class="card">
                <DataTable
                    dataKey="id"
                    :value="parcelas"
                    :paginator="true"
                    :rows="10"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} registros!"
                    responsiveLayout="scroll"
                    filterDisplay="menu"
                >
                    <template #header>
                        <div class="flex justify-content-between">
                            <Button @click.prevent="btnCadastrar()" icon="pi pi-pencil" label="Cadastrar Parcela" class="p-button-info" style="margin-right: 0.25em" />
                        </div>
                    </template>
                    <template #empty> Nenhuma parcela cadastrada! </template>
                    <template #loading> Carregando informações... Por favor, aguarde! </template>

                    <Column field="Mês de Referência" header="Mês de Referência" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">Mês de Referência</span>
                            {{ slotProps.data.mes_referencia }}
                        </template>
                    </Column>

                    <Column field="Dt. de Vencimento" header="Dt. de Vencimento" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">Dt. de Vencimento</span>
                            {{ formatarDataParaBR(slotProps.data.dt_vencimento) }}
                        </template>
                    </Column>

                    <Column field="Observação" header="Observação" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Observação</span>
                            {{ slotProps.data.observacao }}
                        </template>
                    </Column>

                    <Column field="Valor da Parcela" header="Valor da Parcela" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Valor da Parcela</span>
                            {{ slotProps.data.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                        </template>
                    </Column>

                    <Column field="Status" header="Status" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            {{ slotProps.data.status }}
                        </template>
                    </Column>

                    <Column field="..." header="..." :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Qtd. de ativos</span>
                            <Button v-if="slotProps.data.status == 'Pendente'" @click.prevent="btnLink(slotProps.data.id, slotProps.data)" icon="pi pi-pencil" class="p-button-info" />
                            <Button v-if="slotProps.data.status == 'Aprovado'" @click.prevent="btnComprovante(slotProps.data.id)" icon="pi pi-check" class="p-button-success ml-2" />
                            <Button v-if="slotProps.data.status != 'Pago'" @click.prevent="confirmExcluir(slotProps.data.id)" icon="pi pi-trash" class="p-button-danger ml-2" />
                            <Button v-if="slotProps.data.status == 'Pago'" @click.prevent="btnBuscaComprovante(slotProps.data.comprovante)" icon="pi pi-eye" class="p-button-secondary ml-2" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

.titleForm {
    text-align: center;
}

.modalRigth {
    width: 500px;
}

.obrigatorio {
    color: red;
}

.txt-small {
    font-size: small;
    font-style: italic;
}

.full-screen-spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
}
</style>
