<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import ParcelaService from '../../../service/ParcelaService';
import { generatePDF } from '../relatorios/pdfGenerator.js';

export default {
    data() {
        return {
            toast: new useToast(),
            displayConfirmation: ref(false),
            parcelaService: new ParcelaService(),
            displayConfirmationActivation: ref(false),
            visibleRight: ref(false),
            filters1: ref(null),
            router: useRouter(),
            loading1: ref(null),
            empresas: ref(null),
            informacoes: ref(null),
            parcelas: ref(null),
            idEmpresa: ref(null),
            id_contrato: localStorage.getItem('id_contrato'),
            form: ref({}),
            editar: ref(false),
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
    },

    methods: {
        // Metódo responsável por buscar parcelas
        buscaParcelas() {
            this.parcelaService.buscaInformacoes(this.id_contrato).then((data) => {
                this.parcelas = data.mensagem;
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
                    this.form = {};
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
            this.editar = true;
            this.idEmpresa = id;
        },

        btnCadastrar() {
            this.visibleRight = true;
            this.editar = false;
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
        }
    }
};
</script>

<template>
    <div class="grid">
        <div style="z-index: 99" v-if="preloading" class="full-screen-spinner">
            <ProgressSpinner />
        </div>
        <!-- Modal de Cadastro de Parcelas -->
        <Sidebar style="width: 500px" v-model:visible="visibleRight" :baseZIndex="1000" position="right">
            <h3 v-if="this.editar == false" class="titleForm">Formulário de Cadastro</h3>
            <h3 v-if="this.editar == true" class="titleForm">Formulário de Edição</h3>

            <div class="card p-fluid">
                <div class="field">
                    <label for="empresa">Mês de Referência: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <InputText v-model="form.mes_referencia" id="cnpj" type="number" maxlength="2" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" />
                </div>
                <div class="field">
                    <label for="cpf">Data de Vencimento: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <Calendar :showIcon="true" :showButtonBar="true" v-model="form.dt_vencimento"></Calendar>
                </div>
                <div class="field">
                    <label for="cpf">Observação:</label>
                    <InputText v-model="form.observacao" id="cnpj" />
                </div>
                <div class="field">
                    <label for="cpf">Valor da Parcela: <span v-if="this.editar == false" class="obrigatorio">*</span> <span class="txt-small">(Somente números!)</span></label>
                    <InputText v-model="form.valor_parcela" id="cnpj" type="number" />
                </div>
                <hr />
                <div class="field">
                    <Button @click.prevent="cadastrarParcela()" v-if="this.editar == false" label="Cadastrar" class="mr-2 mb-2 p-button-info" />
                    <Button v-if="this.editar == true" label="Editar" class="mr-2 mb-2 p-button-info" />
                </div>
            </div>
        </Sidebar>
        <Button label="Voltar" @click.prevent="voltar()" class="p-button-secondary m-4" icon="pi pi-chevron-left"></Button>

        <!-- Tabela com todas empresas -->
        <div class="col-12">
            <h2 class="titleForm">Contrato nº {{ this.id_contrato }}</h2>
            <div class="col-12 lg:col-6">
                <Toast />
            </div>
            <div v-for="item in informacoes" class="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div class="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                    <div>
                        <div class="font-medium text-3xl text-900">{{ item.servico }} | Unidade: {{ item.unidade_consumidora }}</div>
                        <br /><br />
                        <div class="flex align-items-center text-700 flex-wrap">
                            <div class="mr-5 flex align-items-center mt-3">
                                <i class="pi pi-money-bill mr-2"></i>
                                <span>Valor: R$ {{ item.valor_contrato }}</span>
                            </div>
                            <div class="mr-5 flex align-items-center mt-3">
                                <i class="pi pi-sitemap mr-2"></i>
                                <span>Qtd. Parcelas: {{ item.qtd_parcelas }}</span>
                            </div>
                            <div class="flex align-items-center mt-3 mr-4">
                                <i class="pi pi-building mr-2"></i>
                                <span>Empresa: {{ item.nome_empresa }}</span>
                            </div>
                            <div class="flex align-items-center mt-3 mr-4">
                                <i class="pi pi-user mr-2"></i>
                                <span>Fornecedor: {{ item.nome }}</span>
                            </div>
                            <div class="flex align-items-center mt-3 mr-4">
                                <i class="pi pi-id-card mr-2"></i>
                                <span>Nome Fantasia: {{ item.nome_fantasia }}</span>
                            </div>
                            <div class="flex align-items-center mt-3">
                                <i class="pi pi-info mr-2"></i>
                                <span>CNPJ: {{ formatarCNPJ(item.cnpj) }}</span>
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

                    <Column field="Valor da Parcela" header="Valor da Parcela" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">Valor da Parcela</span>
                            R$ {{ slotProps.data.valor }}
                        </template>
                    </Column>

                    <Column field="Status" header="Status" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            {{ slotProps.data.status }}
                        </template>
                    </Column>

                    <Column field="editar" header="Editar" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Qtd. de ativos</span>
                            <Button @click.prevent="btnEditar(slotProps.data.id, slotProps.data)" label="Enviar Diretôria" icon="pi pi-check" class="p-button-info" />
                            <Button v-if="slotProps.data.status == 'Pago'" @click.prevent="btnEditar(slotProps.data.id, slotProps.data)" label="Comprovante" icon="pi pi-check" class="p-button-secondary ml-2" />
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
