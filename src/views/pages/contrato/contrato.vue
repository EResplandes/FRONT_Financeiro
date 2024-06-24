<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import FornecedorService from '../../../service/FornecedorService';
import ContratoService from '../../../service/ContratoService';
import EmpresaService from '../../../service/EmpresaService';
import UnidadeService from '../../../service/UnidadeService';

export default {
    data() {
        return {
            toast: new useToast(),
            displayConfirmation: ref(false),
            fornecedorService: new FornecedorService(),
            empresaService: new EmpresaService(),
            contratoService: new ContratoService(),
            unidadeService: new UnidadeService(),
            router: useRouter(),
            displayConfirmationActivation: ref(false),
            visibleRight: ref(false),
            unidades: ref(false),
            visible2: ref(false),
            visible3: ref(false),
            filters1: ref(null),
            filtros: ref({}),
            loading1: ref(null),
            empresas: ref([]),
            empresasForm: ref(null),
            filtroSelecionado: ref({}),
            fornecedores: ref(null),
            contratos: ref(null),
            idFornecedor: ref(null),
            form: ref({}),
            editar: ref(false),
            preloading: ref(true),
            parcelasAuto: ref(null)
        };
    },

    mounted: function () {
        // Metódo responsável por buscar todas as fornecedores
        this.fornecedorService.buscaFornecedores().then((data) => {
            this.fornecedores = data.response;
        });

        // Metódo responsável por buscar todos os contratos
        this.contratoService.buscaContratos().then((data) => {
            this.contratos = data.mensagem;
            this.preloading = false;
        });

        // Metódo responsável por buscar todas as empresas
        this.empresaService.buscaEmpresas().then((data) => {
            this.empresas = data.response;
        });
    },

    methods: {
        // Metódo responsável por buscar todas fornecedores
        buscaFornecedores() {
            this.fornecedorService.buscaFornecedores().then((data) => {
                this.fornecedores = data.response;
            });
        },

        // Metódo responsável por buscar todos contratos
        buscaContratos() {
            this.preloading = true;
            this.contratoService.buscaContratos().then((data) => {
                this.contratos = data.mensagem;
                this.preloading = false;
            });
        },

        // Metódo responsável por buscar empresas
        buscaEmpresas() {
            this.empresaService.buscaEmpresas().then((data) => {
                this.empresas = data.response;
            });
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

        // Metódo responsável por limpar filtros
        limparFiltro() {
            this.buscaContratos();
            this.filtroSelecionado = {};
            this.showInfo('Filtro removidos com sucesso!');
        },

        // Método responsável por aplicar filtros
        filtrarContratos() {
            this.preloading = true;
            this.contratoService
                .buscaContratoFil(this.filtroSelecionado)
                .then((data) => {
                    this.preloading = false;
                    if (data.mensagem !== null) {
                        this.contratos = data.mensagem;
                        this.showInfo('Filtro aplicado com sucesso!');
                    } else {
                        this.showError('Selecione a empresa desejada!');
                    }
                })
                .catch((error) => {
                    this.preloading = false;
                    if (error instanceof TypeError && error.message.includes('Cannot read properties of undefined')) {
                        this.showError('Selecione a empresa desejada!');
                    } else {
                        console.error('Erro:', error);
                    }
                });
        },

        // Metódo responsável por buscar unidades consumidoras
        buscaUnidades() {
            this.unidadeService.buscaUnidades().then((data) => {
                this.unidades = data.response;
            });
        },

        // Metódo responsável por selecioanr unidade
        selecionarUnidade(id_unidade) {
            this.form.id_unidade = id_unidade;
            this.visible2 = false;
            this.showInfo('Unidade consumidora selecioanda com sucesso!');
        },

        // Metódo responsável por selecionar fornecedor
        selecionarFornecedor(id_fornecedor) {
            this.form.id_fornecedor = id_fornecedor;
            this.visible3 = false;
            this.showInfo('Fornecedor selecionado com sucesso!');
        },

        // Metódo responsável por selecionar emepresa
        selecionarEmpresa(id_empresa) {
            this.form.id_empresa = id_empresa;
            this.visible = false;
            this.showInfo('Empresa selecioanada com sucesso!');
        },

        // Metódo responsável por buscar parcelas
        buscaInfoContrato(id_contrato) {
            let salva_local = localStorage.setItem('id_contrato', id_contrato);
            this.router.push('/parcelas'); // Mandando para tela principal
        },

        // Metódo responsável por cadastrar contrato
        cadastrarContrato() {
            this.preloading = true;
            this.contratoService.cadastrarContrato(this.form).then((data) => {
                if (data.mensagem == 'Contrato criado com sucesso!') {
                    this.showSuccess('Contrato criado com sucesso!');
                    this.buscaContratos();
                    this.preloading = false;
                    this.visibleRight = false;
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
                    this.preloading = false;
                }
            });
        },

        // Metódo respomsável por aplicar filtros
        buscaFiltrosUnidade() {
            this.preloading = true;
            this.unidadeService.buscaUnidadeFiltros(this.filtros).then((data) => {
                this.unidades = data.response;
                this.showInfo('Filtros aplicados com sucesso!');
                this.preloading = false;
            });
        },

        // Metódo respomsável por limpar filtros
        limparFiltroUnidade() {
            this.filtros = {};
            this.buscaUnidades();
            this.showInfo('Filtros removidos com sucesso!');
        },

        // Metódo respomsável por aplicar filtros
        buscaFiltrosFornecedor() {
            this.preloading = true;
            this.fornecedorService.buscaFornecedoresFiltros(this.filtros).then((data) => {
                this.fornecedores = data.response;
                this.preloading = false;
                this.showInfo('Filtros aplicados com sucesso!');
            });
        },

        // Metódo respomsável por limpar filtros
        limparFiltroFornecedor() {
            this.filtros = {};
            this.buscaFornecedores();
        },

        // Metódo responsável por buscar empresas com filtros
        buscaFiltrosEmpresa() {
            this.preloading = true;
            this.empresaService.buscaEmpresasFiltros(this.filtros).then((data) => {
                this.empresas = data.response;
                this.showInfo('Filtros aplicados com sucesso!');
                this.preloading = false;
            });
        },

        // Metódo responsável por limpagem de filtros
        limparFiltroEmpresa() {
            this.buscaEmpresas();
            this.showInfo('Filtro removidos com sucesso!');
            this.filtros = {};
        }
    }
};
</script>

<template>
    <div style="z-index: 99" v-if="preloading" class="full-screen-spinner">
        <ProgressSpinner />
    </div>

    <h2 class="titleForm">Módulo de Contratos</h2>
    <hr />
    <div class="p-fluid formgrid grid mt-5 mb-5">
        <div class="field col-12 md:col-3">
            <label for="firstname2">Serviço:</label>
            <InputText v-model="filtroSelecionado.servico" id="firstname2" type="text" placeholder="Digite o serviço..." />
        </div>

        <div class="field col-12 md:col-3">
            <label for="firstname2">Empresa: <span class="obrigatorio">*</span></label>
            <Dropdown id="state" v-model="filtroSelecionado.empresa" :options="empresas" optionLabel="empresa" placeholder="Selecione..."></Dropdown>
        </div>

        <div class="field col-12 md:col-3">
            <label for="">Filtros:</label>
            <Button @click.prevent="filtrarContratos()" type="button" class="mr-2 mb-2 p-button-info" label="FILTRAR" icon="pi pi-search" />
        </div>

        <div class="field col-12 md:col-3">
            <label for="">Limpar Filtros:</label>
            <Button @click.prevent="limparFiltro()" type="button" class="mr-2 mb-2 p-button-danger" label="LIMPAR FILTROS" icon="pi pi-trash" />
        </div>
    </div>

    <div class="grid">
        <!-- Dialogo para selecionar unidade consumidora -->
        <Dialog v-model:visible="visible2" modal header="Unidade Consumidora" :style="{ width: '75rem' }">
            <div class="grid">
                <!-- Filtros -->
                <div class="p-fluid formgrid grid justify-content-end">
                    <div class="field col-12 md:col-3">
                        <label for="firstname2">Unidade: <span class="obrigatorio">*</span></label>
                        <InputText v-model="filtros.nome" id="firstname2" type="text" placeholder="Digite o nome da unidade consumidora..." />
                    </div>

                    <div class="field col-12 md:col-3">
                        <label for="">Filtros:</label>
                        <Button @click.prevent="buscaFiltrosUnidade()" type="button" class="mr-2 mb-2 p-button-info" label="FILTRAR" icon="pi pi-search" />
                    </div>

                    <div class="field col-12 md:col-3">
                        <label for="">Limpar Filtros:</label>
                        <Button @click.prevent="limparFiltroUnidade()" type="button" class="mr-2 mb-2 p-button-danger" label="LIMPAR FILTROS" icon="pi pi-trash" />
                    </div>
                </div>

                <div class="col-12 md:col-12">
                    <DataTable
                        dataKey="id"
                        :value="unidades"
                        :paginator="true"
                        :rows="10"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} registros!"
                        responsiveLayout="scroll"
                        :filters="filters1"
                        filterDisplay="menu"
                    >
                        <template #header> </template>
                        <template #empty> Nenhuma empresa encontrada! </template>
                        <template #loading> Carregando informações... Por favor, aguarde! </template>

                        <Column field="ID" header="ID" :sortable="true" class="w-1">
                            <template #body="slotProps">
                                <span class="p-column-title">ID</span>
                                {{ slotProps.data.id }}
                            </template>
                        </Column>

                        <Column field="Unidade Consumidora" header="Unidade Consumidora" :sortable="true" class="w-9">
                            <template #body="slotProps">
                                <span class="p-column-title">Unidade Consumidora</span>
                                {{ slotProps.data.nome }}
                            </template>
                        </Column>

                        <Column field="editar" header="Editar" :sortable="true" class="w-2">
                            <template #body="slotProps">
                                <span class="p-column-title">Qtd. de ativos</span>

                                <Button @click.prevent="selecionarUnidade(slotProps.data.id)" label="Selecionar" icon="pi pi-check" class="p-button-info" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </Dialog>

        <!-- Dialogo para selecionar o fornecedor -->
        <Dialog v-model:visible="visible3" modal header="Fornecedor" :style="{ width: '75rem' }">
            <div class="p-fluid formgrid grid mt-5 mb-5">
                <div class="field col-12 md:col-3">
                    <label for="firstname2">Nome: </label>
                    <InputText v-model="filtros.nome" id="firstname2" type="text" placeholder="Digite o nome do fornecedor..." />
                </div>

                <div class="field col-12 md:col-3">
                    <label for="firstname2">Nome Fantasia: </label>
                    <InputText v-model="filtros.nome_fantasia" id="firstname2" type="text" placeholder="Digite o nome do fornecedor..." />
                </div>

                <div class="field col-12 md:col-2">
                    <label for="firstname2">CNPJ/CPF: </label>
                    <InputText v-model="filtros.cnpj" id="firstname2" type="text" placeholder="Digite o cnpj ou cpf..." />
                </div>

                <div class="field col-12 md:col-2">
                    <label for="">Filtros:</label>
                    <Button @click.prevent="buscaFiltrosFornecedor()" type="button" class="mr-2 mb-2 p-button-info" label="FILTRAR" icon="pi pi-search" />
                </div>

                <div class="field col-12 md:col-2">
                    <label for="">Limpar Filtros:</label>
                    <Button @click.prevent="limparFiltroFornecedor()" type="button" class="mr-2 mb-2 p-button-danger" label="LIMPAR" icon="pi pi-trash" />
                </div>
            </div>
            <div class="grid">
                <div class="col-12 md:col-12">
                    <DataTable
                        dataKey="id"
                        :value="fornecedores"
                        :paginator="true"
                        :rows="10"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} registros!"
                        responsiveLayout="scroll"
                        :filters="filters1"
                        filterDisplay="menu"
                    >
                        <template #header> </template>
                        <template #empty> Nenhuma empresa encontrada! </template>
                        <template #loading> Carregando informações... Por favor, aguarde! </template>

                        <Column field="ID" header="ID" :sortable="true" class="w-1">
                            <template #body="slotProps">
                                <span class="p-column-title">ID</span>
                                {{ slotProps.data.id }}
                            </template>
                        </Column>

                        <Column field="Nome" header="Nome" :sortable="true" class="w-2">
                            <template #body="slotProps">
                                <span class="p-column-title">Nome</span>
                                {{ slotProps.data.nome }}
                            </template>
                        </Column>

                        <Column field="Nome Fantasia" header="Nome Fantasia" :sortable="true" class="w-2">
                            <template #body="slotProps">
                                <span class="p-column-title">Nome Fantasia</span>
                                {{ slotProps.data.nome_fantasia }}
                            </template>
                        </Column>

                        <Column field="CNPJ ou CPF" header="CNPJ ou CPF" :sortable="true" class="w-2">
                            <template #body="slotProps">
                                <span class="p-column-title">CNPJ ou CPF</span>
                                {{ slotProps.data.cnpj }}
                            </template>
                        </Column>

                        <Column field="editar" header="Editar" :sortable="true" class="w-2">
                            <template #body="slotProps">
                                <span class="p-column-title">Qtd. de ativos</span>

                                <Button @click.prevent="selecionarFornecedor(slotProps.data.id)" label="Selecionar" icon="pi pi-check" class="p-button-info" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </Dialog>

        <!-- Modal de Cadastro de fornecedores -->
        <Sidebar style="width: 500px" v-model:visible="visibleRight" :baseZIndex="1000" position="right">
            <h4 class="titleForm">Formulário de Cadastro</h4>

            <div class="card p-fluid">
                <div class="field">
                    <label for="empresa">Serviço: <span class="obrigatorio">*</span></label>
                    <InputText v-model="form.servico" id="unidade" type="text" required placeholder="Digite o serviço..." />
                </div>

                <div class="field">
                    <label for="empresa">Contrato: <span class="obrigatorio">*</span></label>
                    <InputText v-model="form.contrato" id="nome_fantasia" type="text" required placeholder="Digite o número do contrato..." />
                </div>

                <div class="field">
                    <label for="firstname2">Empresa: <span class="obrigatorio">*</span></label>
                    <Dropdown id="state" v-model="form.id_empresa" :options="empresas" optionLabel="empresa" placeholder="Selecione..."></Dropdown>
                </div>

                <!-- <div class="field">
                    <label for="empresa">Valor Contrato: </label>
                    <InputText v-model="form.valor_contrato" id="nome_fantasia" type="text" required placeholder="Digite o valor total do contrato..." />
                </div> -->

                <h class="titleForm">Unidade Consumidora <span class="obrigatorio">*</span></h>
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.id_unidade" id="unidade" type="text" required />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <Button @click.prevent="buscaUnidades()" label="Selecionar" class="mr-2 mb-2 p-button-info" @click="visible2 = true" />
                        </div>
                    </div>
                </div>
                <h class="titleForm">Fornecedor <span class="obrigatorio">*</span></h>
                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.id_fornecedor" id="unidade" type="text" required />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <Button label="Selecionar" class="mr-2 mb-2 p-button-info" @click="visible3 = true" />
                        </div>
                    </div>
                </div>

                <br />
                <!-- <div class="grid">
                    <div class="field-checkbox mb-0">
                        <Checkbox id="checkOption1" name="option" value="true" v-model="parcelasAuto" />
                        <label for="checkOption1">Gerar parcelas autómaticas</label>
                    </div>
                </div> -->
                <!-- <br />
                <br /> -->
                <!-- <div v-if="parcelasAuto == 'true'" class="grid">
                    <div class="grid">
                        <div class="col-4 md:col-4">
                            <div class="field-checkbox mb-0">
                                <InputText v-model="form.qtd_parcelas" placeholder="Qtd. de Parcelas" />
                            </div>
                        </div>
                        <div class="col-6 md:col-4">
                            <div class="field-checkbox mb-0">
                                <InputText v-model="form.mes_referencia" placeholder="Mês Ref. 1º parcela" />
                            </div>
                        </div>
                        <div class="col-4 md:col-4">
                            <div class="field-checkbox mb-0">
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="form.data_vencimento" placeholder="Vencimento"></Calendar>
                            </div>
                        </div>
                    </div>
                </div> -->

                <!-- <hr /> -->

                <div class="field">
                    <Button @click.prevent="cadastrarContrato()" label="Cadastrar" class="mr-2 mb-2 p-button-info" />
                </div>
            </div>
        </Sidebar>

        <!-- Tabela com todos fornecedores -->
        <div class="col-12">
            <div class="col-12 lg:col-6">
                <Toast />
            </div>
            <div class="card">
                <DataTable
                    dataKey="id"
                    :value="contratos"
                    :paginator="true"
                    :rows="10"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25, 50, 100]"
                    currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} registros!"
                    responsiveLayout="scroll"
                    :filters="filters1"
                    filterDisplay="menu"
                >
                    <template #header>
                        <div class="flex justify-content-between">
                            <Button @click.prevent="btnCadastrar()" icon="pi pi-pencil" label="Cadastrar" class="p-button-info" style="margin-right: 0.25em" />
                        </div>
                    </template>
                    <template #empty> Nenhum contrato encontrado! </template>
                    <template #loading> Carregando informações... Por favor, aguarde! </template>

                    <Column field="ID" header="ID" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>

                    <Column field="Servico" header="Servico" :sortable="true" class="w-3">
                        <template #body="slotProps">
                            <span class="p-column-title">Servico</span>
                            {{ slotProps.data.servico }}
                        </template>
                    </Column>

                    <Column field="Contrato" header="Contrato" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">Contrato</span>
                            {{ slotProps.data.contrato ? slotProps.data.contrato : 'N/C' }}
                        </template>
                    </Column>

                    <Column field="Empresa" header="Empresa" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Empresa</span>
                            {{ slotProps.data.nome_empresa }}
                        </template>
                    </Column>

                    <Column field="Fornecedor" header="Fornecedor" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Fornecedor</span>
                            {{ slotProps.data.nome }}
                        </template>
                    </Column>

                    <Column field="Unidade Consumidora" header="Unidade Consumidora" :sortable="true" class="w-3">
                        <template #body="slotProps">
                            <span class="p-column-title">Unidade Consumidora</span>
                            {{ slotProps.data.unidade_consumidora }}
                        </template>
                    </Column>

                    <Column field="Qtd. Parcelas" header="Qtd. Parcelas" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">Qtd. Parcelas</span>
                            {{ slotProps.data.qtd_parcelas ? slotProps.data.qtd_parcelas : 'N/C' }}
                        </template>
                    </Column>

                    <Column field="Valor Total Contrato" header="Valor Total Contrato" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Valor Total Contrato</span>
                            {{ slotProps.data.valor_contrato ? slotProps.data.valor_contrato.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/C' }}
                        </template>
                    </Column>

                    <Column field="Visualizar" header="Visualizar" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <Button class="p-button-secondary" icon="pi pi-eye" @click.prevent="buscaInfoContrato(slotProps.data.id)" />
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
