<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import UnidadeService from '../../../service/UnidadeService.js';

export default {
    data() {
        return {
            toast: new useToast(),
            displayConfirmation: ref(false),
            unidadeService: new UnidadeService(),
            displayConfirmationActivation: ref(false),
            visibleRight: ref(false),
            filters1: ref(null),
            loading1: ref(null),
            unidades: ref(null),
            idUnidade: ref(null),
            form: ref({}),
            filtros: ref({}),
            editar: ref(false),
            preloading: ref(true)
        };
    },

    mounted: function () {
        // Metódo responsável por buscar todas as unidades
        this.unidadeService.buscaUnidades().then((data) => {
            this.unidades = data.response;
            this.preloading = false;
        });
    },

    methods: {
        // Metódo responsável por buscar todas unidades
        buscaUnidades() {
            this.preloading = true;
            this.unidadeService.buscaUnidades().then((data) => {
                this.unidades = data.response;
                this.preloading = false;
            });
        },

        // Metódo responsável por cadastrar unidade
        cadastrarUnidade() {
            this.unidadeService.cadastraUnidade(this.form).then((data) => {
                if (data.response == 'Unidade consumidora cadastrada com sucesso!') {
                    this.showSuccess('Unidade consumidora cadastrada com sucesso!');
                    this.buscaUnidades();
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

        // Metódo responsável por editar unidade
        editaUnidade() {
            this.unidadeService.editaUnidade(this.idUnidade, this.form).then((data) => {
                if (data.response != 'Unidade consumidora atualizada com sucesso!') {
                    this.showError('Preencha pelo menos 1 campo.');
                } else {
                    this.showSuccess('Unidade consumidora atualizada com sucesso!');
                    this.form = {};
                    this.buscaUnidades();
                }
            });
        },

        btnEditar(id, info) {
            this.form.unidade = info.nome;
            this.visibleRight = true;
            this.editar = true;
            this.idUnidade = id;
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

        // Metódo respomsável por aplicar filtros
        buscaFiltros() {
            this.preloading = true;
            this.unidadeService.buscaUnidadeFiltros(this.filtros).then((data) => {
                this.unidades = data.response;
                this.showInfo('Filtros aplicados com sucesso!');
                this.preloading = false;
            });
        },

        // Metódo respomsável por limpar filtros
        limparFiltro() {
            this.filtros = {};
            this.buscaUnidades();
            this.showInfo('Filtros removidos com sucesso!');
        }
    }
};
</script>

<template>
    <div style="z-index: 99" v-if="preloading" class="full-screen-spinner">
        <ProgressSpinner />
    </div>

    <h2 class="titleForm">Módulo de Unidades Consumidoras</h2>

    <hr />
    
    <!-- Filtros -->
    <div class="p-fluid formgrid grid mt-5 mb-5">
        <div class="field col-12 md:col-3">
            <label for="firstname2">Unidade: <span class="obrigatorio">*</span></label>
            <InputText v-model="filtros.nome" id="firstname2" type="text" />
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
        <!-- Modal de Cadastro de unidades -->
        <Sidebar style="width: 500px" v-model:visible="visibleRight" :baseZIndex="1000" position="right">
            <h3 v-if="this.editar == false" class="titleForm">Formulário de Cadastro</h3>
            <h3 v-if="this.editar == true" class="titleForm">Formulário de Edição</h3>

            <div class="card p-fluid">
                <div class="field">
                    <label for="empresa">Unidade Consumidora: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <InputText v-model="form.unidade" id="unidade" type="text" required />
                </div>
                <hr />
                <div class="field">
                    <Button v-if="this.editar == false" @click.prevent="cadastrarUnidade()" label="Cadastrar" class="mr-2 mb-2 p-button-info" />
                    <Button v-if="this.editar == true" @click.prevent="editaUnidade()" label="Editar" class="mr-2 mb-2 p-button-info" />
                    <Button v-if="this.editar == false" label="importar" class="mr-2 mb-2" />
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

                    <Column field="Unidade Consumidora" header="Unidade Consumidora" :sortable="true" class="w-9">
                        <template #body="slotProps">
                            <span class="p-column-title">Unidade Consumidora</span>
                            {{ slotProps.data.nome }}
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
