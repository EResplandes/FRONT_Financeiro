<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import EmpresaService from '../../../service/EmpresaService';

export default {
    data() {
        return {
            toast: new useToast(),
            displayConfirmation: ref(false),
            empresaService: new EmpresaService(),
            displayConfirmationActivation: ref(false),
            visibleRight: ref(false),
            filtros: ref({}),
            loading1: ref(null),
            empresas: ref(null),
            idEmpresa: ref(null),
            filtroSelecionado: ref({}),
            form: ref({}),
            editar: ref(false),
            preloading: ref(true)
        };
    },

    mounted: function () {
        // Metódo responsável por buscar todas as empresas
        this.empresaService.buscaEmpresas().then((data) => {
            this.empresas = data.response;
            this.preloading = false;
        });
    },

    methods: {
        // Metódo responsável por buscar todas empresas
        buscaEmpresas() {
            this.preloading = true;

            this.empresaService.buscaEmpresas().then((data) => {
                this.empresas = data.response;
                this.preloading = false;
            });
        },

        // Metódo responsável por cadastrar Empresa
        cadastrarEmpresa() {
            this.empresaService.cadastraEmpresa(this.form).then((data) => {
                if (data.response == 'A empresa foi cadastrada com sucesso!') {
                    this.showSuccess('Empresa cadastrada com sucesso!');
                    this.buscaEmpresas();
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

        // Metódo responsável por editar empresa
        editaEmpresa() {
            this.empresaService.editaEmpresa(this.idEmpresa, this.form).then((data) => {
                if (data.response != 'Empresa atualizada com sucesso!') {
                    this.showError('Preencha pelo menos 1 campo.');
                } else {
                    this.showSuccess('Empresa atualizada com sucesso!');
                    this.form = {};
                    this.buscaEmpresas();
                }
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

        // Metódo responsável por buscar empresas com filtros
        buscaFiltros() {
            this.preloading = true;
            this.empresaService.buscaEmpresasFiltros(this.filtros).then((data) => {
                console.log(data);
                this.empresas = data.response;
                this.showInfo('Filtros aplicados com sucesso!');
                this.preloading = false;
            });
        },

        // Metódo responsável por limpagem de filtros
        limparFiltro() {
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

    <h2 class="titleForm">Módulo de Empresas</h2>
    <hr />

    <div class="p-fluid formgrid grid mt-5 mb-5">
        <div class="field col-12 md:col-3">
            <label for="firstname2">Nome: <span class="obrigatorio">*</span></label>
            <InputText v-model="filtros.empresa" id="firstname2" type="text" placeholder="Digite o nome da empresa..."/>
        </div>

        <div class="field col-12 md:col-3">
            <label for="firstname2">CNPJ/CPF: <span class="obrigatorio">*</span></label>
            <InputText v-model="filtros.cnpj" id="firstname2" type="text" placeholder="Digite o cnpj ou cpf da empresa..."/>
        </div>

        <div class="field col-12 md:col-3">
            <label for="">Filtros:</label>
            <Button @click.prevent="buscaFiltros()" type="button" class="mr-2 mb-2 p-button-info" label="FILTRAR" icon="pi pi-search" />
        </div>

        <div class="field col-12 md:col-3">
            <label for="">Limpar Filtros:</label>
            <Button @click.prevent="limparFiltro()" type="button" class="mr-2 mb-2 p-button-danger" label="LIMPAR FILTROS" icon="pi pi-trash" />
        </div>
    </div>
    <hr />

    <div class="grid">
        <!-- Modal de Cadastro de Empresa -->
        <Sidebar style="width: 500px" v-model:visible="visibleRight" :baseZIndex="1000" position="right">
            <h3 v-if="this.editar == false" class="titleForm">Formulário de Cadastro</h3>
            <h3 v-if="this.editar == true" class="titleForm">Formulário de Edição</h3>

            <div class="card p-fluid">
                <div class="field">
                    <label for="empresa">Empresa: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <InputText v-model="form.empresa" id="empresa" type="text" required />
                </div>
                <div class="field">
                    <label for="cpf">CNPJ / CPF: <span v-if="this.editar == false" class="obrigatorio">*</span> <span class="txt-small">(Somente números!)</span></label>
                    <InputText v-model="form.cnpj" id="cnpj" type="number" maxlength="14" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" />
                </div>
                <hr />
                <div class="field">
                    <Button v-if="this.editar == false" @click.prevent="cadastrarEmpresa()" label="Cadastrar" class="mr-2 mb-2 p-button-info" />
                    <Button v-if="this.editar == true" @click.prevent="editaEmpresa()" label="Editar" class="mr-2 mb-2 p-button-info" />
                </div>
            </div>
        </Sidebar>

        <!-- Tabela com todas empresas -->
        <div class="col-12">
            <div class="col-12 lg:col-6">
                <Toast />
            </div>
            <div class="card">
                <DataTable
                    dataKey="id"
                    :value="empresas"
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
                            <Button @click.prevent="btnCadastrar()" icon="pi pi-pencil" label="Cadastrar" class="p-button-info" style="margin-right: 0.25em" />
                        </div>
                    </template>
                    <template #empty> Nenhuma empresa encontrada! </template>
                    <template #loading> Carregando informações... Por favor, aguarde! </template>

                    <Column field="ID" header="ID" :sortable="true" class="w-1">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>

                    <Column field="Empresa" header="Empresa" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Empresa</span>
                            {{ slotProps.data.empresa }}
                        </template>
                    </Column>

                    <Column field="CNPJ" header="CNPJ / CPF" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">CNPJ</span>
                            {{ formatarCNPJ(slotProps.data.cnpj) }}
                        </template>
                    </Column>

                    <Column field="editar" header="Editar" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Qtd. de ativos</span>

                            <Button @click.prevent="btnEditar(slotProps.data.id, slotProps.data)" label="Editar" icon="pi pi-check" class="p-button-info" />
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
