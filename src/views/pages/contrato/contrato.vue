<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import FornecedorService from '../../../service/FornecedorService';

export default {
    data() {
        return {
            toast: new useToast(),
            displayConfirmation: ref(false),
            fornecedorService: new FornecedorService(),
            displayConfirmationActivation: ref(false),
            visibleRight: ref(false),
            visible2: ref(false),
            filters1: ref(null),
            loading1: ref(null),
            fornecedores: ref(null),
            idFornecedor: ref(null),
            form: ref({}),
            editar: ref(false),
            preloading: ref(true)
        };
    },

    mounted: function () {
        // Metódo responsável por buscar todas as fornecedores
        this.fornecedorService.buscaFornecedores().then((data) => {
            this.fornecedores = data.response;
        });
    },

    methods: {
        // Metódo responsável por buscar todas fornecedores
        buscaFornecedores() {
            this.fornecedorService.buscaFornecedores().then((data) => {
                this.fornecedores = data.response;
            });
        },

        // Metódo responsável por cadastrar fornecedor
        cadastrarFornecedor() {
            this.fornecedorService.cadastraFornecedor(this.form).then((data) => {
                console.log(this.form);
                console.log(data);

                if (data.response == 'Fornecedor cadastrado com sucesso!') {
                    this.showSuccess('Fornecedor cadastrado com sucesso!');
                    this.buscaFornecedores();
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
        editaFornecedor() {
            this.fornecedorService.editarFornecedor(this.idFornecedor, this.form).then((data) => {
                console.log(data);
                if (data.response != 'Fornecedor atualizado com sucesso!') {
                    this.showError('Preencha pelo menos 1 campo.');
                } else {
                    this.showSuccess('Fornecedor atualizado com sucesso!');
                    this.form = {};
                    this.buscaFornecedores();
                }
            });
        },

        btnEditar(id, info) {
            this.form.nome = info.nome;
            this.form.banco = info.cod_banco;
            this.form.agencia = info.agencia;
            this.form.conta = info.conta;
            this.form.descricao_banco = info.descricao_banco;
            this.form.nome_fantasia = info.nome_fantasia;
            this.form.cnpj = info.cnpj;
            this.form.login = info.login;
            this.form.senha = info.senha;
            this.visibleRight = true;
            this.editar = true;
            this.idFornecedor = id;
        },

        btnCadastrar() {
            this.visibleRight = true;
            this.editar = false;
        },

        dadosBancarios(id, info) {
            this.form.nome = info.nome;
            this.form.banco = info.cod_banco;
            this.form.agencia = info.agencia;
            this.form.conta = info.conta;
            this.idFornecedor = id;
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

        showSuccess(mensagem) {
            this.toast.add({ severity: 'success', summary: 'Sucesso!', detail: mensagem, life: 3000 });
        },

        showInfo(mensagem) {
            this.toast.add({ severity: 'info', summary: 'Aviso!', detail: mensagem, life: 3000 });
        },

        showError(mensagem) {
            this.toast.add({ severity: 'error', summary: 'Ocorreu um erro!', detail: mensagem, life: 3000 });
        }
    }
};
</script>

<template>
    <div class="p-fluid formgrid grid mt-5 mb-5">
        <div class="field col-12 md:col-3">
            <label for="firstname2">Serviço:</label>
            <InputText v-model="name" id="firstname2" type="text" />
        </div>

        <div class="field col-12 md:col-3">
            <label for="firstname2">Empresa:</label>
            <Dropdown id="state" v-model="empresaSelec" :options="empresa" optionLabel="name" placeholder="Selecione..."></Dropdown>
        </div>

        <div class="field col-12 md:col-3">
            <label for="">Filtros:</label>
            <Button @click.prevent="filterProducts()" type="button" class="mr-2 mb-2 p-button-info" label="FILTRAR" icon="pi pi-search" />
        </div>

        <div class="field col-12 md:col-3">
            <label for="">Limpar Filtros:</label>
            <Button @click.prevent="cleanFilter()" type="button" class="mr-2 mb-2 p-button-danger" label="LIMPAR FILTROS" icon="pi pi-trash" />
        </div>
    </div>

    <div class="grid">
        <!-- <div style="z-index: 9999999999999999999" v-if="preloading" class="full-screen-spinner">
            <ProgressSpinner />
        </div> -->

        <Dialog v-model:visible="visible2" modal header="PARCELAS" :style="{ width: '50rem' }"
            ><br />
            <div class="grid">
                <div class="col-12 md:col-12">
                    <div class="field-checkbox mb-0">
                        <label class="m-3" for="empresa">Fornecedor: </label>
                        <InputText disabled v-model="form.nome" />
                    </div>
                </div>
                <div class="col-4 md:col-4">
                    <div class="field-checkbox mb-0">
                        <InputText disabled :value="'Banco: ' + form.banco" />
                    </div>
                </div>
                <div class="col-6 md:col-4">
                    <div class="field-checkbox mb-0">
                        <InputText disabled :value="'Agência: ' + form.agencia" />
                    </div>
                </div>
                <div class="col-4 md:col-4">
                    <div class="field-checkbox mb-0">
                        <InputText disabled :value="'Conta: ' + form.conta" />
                    </div>
                </div>
            </div>
        </Dialog>

        <!-- Modal de Cadastro de fornecedores -->
        <Sidebar style="width: 500px" v-model:visible="visibleRight" :baseZIndex="1000" position="right">
            <h3 v-if="this.editar == false" class="titleForm">Formulário de Cadastro</h3>
            <h3 v-if="this.editar == true" class="titleForm">Formulário de Edição</h3>

            <div class="card p-fluid">
                <div class="field">
                    <label for="empresa">Serviço: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <InputText v-model="form.nome" id="unidade" type="text" required />
                </div>

                <div class="field">
                    <label for="empresa">Contrato: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <InputText v-model="form.nome_fantasia" id="nome_fantasia" type="text" required />
                </div>

                <div class="field">
                    <label for="firstname2">Empresa: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <Dropdown id="state" v-model="empresaSelec" :options="empresa" optionLabel="name" placeholder="Selecione..."></Dropdown>
                </div>
                <hr />

                <h5 class="titleForm">Valores <span v-if="this.editar == false" class="obrigatorio">*</span></h5>

                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <InputNumber id="qtd_parcelas" type="text" required placeholder="Qtd. Parcelas" />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <InputNumber id="valor" type="text" required placeholder="Valor do Contrato" />
                        </div>
                    </div>
                </div>

                <hr />

                <h5 class="titleForm">Unidade Consumidora <span v-if="this.editar == false" class="obrigatorio">*</span></h5>

                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.nome" id="unidade" type="text" required />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <Button v-if="this.editar == false" label="Selecionar" class="mr-2 mb-2 p-button-info" />
                        </div>
                    </div>
                </div>
                <hr />

                <h5 class="titleForm">Fornecedor <span v-if="this.editar == false" class="obrigatorio">*</span></h5>

                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.nome" id="unidade" type="text" required />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <Button v-if="this.editar == false" label="Selecionar" class="mr-2 mb-2 p-button-info" />
                        </div>
                    </div>
                </div>
                <hr />

                <div class="grid">
                    <div class="field-checkbox mb-0">
                        <Checkbox id="checkOption1" name="option" value="true" v-model="checkboxValue" />
                        <label for="checkOption1">Gerar parcelas autómaticas</label>
                    </div>
                </div>
                <hr />

                <div class="field">
                    <Button v-if="this.editar == false" @click.prevent="cadastrarFornecedor()" label="Cadastrar" class="mr-2 mb-2 p-button-info" />
                    <Button v-if="this.editar == true" @click.prevent="editaFornecedor()" label="Editar" class="mr-2 mb-2 p-button-info" />
                </div>
            </div>
        </Sidebar>

        <!-- Tabela com todos fornecedores -->
        <div class="col-12">
            <h2 class="titleForm">Contratos</h2>
            <div class="col-12 lg:col-6">
                <Toast />
            </div>
            <div class="card">
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

                    <Column field="Servico" header="Servico" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Servico</span>
                            {{ slotProps.data.nome }}
                        </template>
                    </Column>

                    <Column field="Contrato" header="Contrato" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Contrato</span>
                            {{ slotProps.data.nome_fantasia }}
                        </template>
                    </Column>

                    <Column field="Empresa" header="Empresa" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Empresa</span>
                            {{ formatarCNPJ(slotProps.data.cnpj) }}
                        </template>
                    </Column>

                    <Column field="Fornecedor" header="Fornecedor" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Fornecedor</span>
                            {{ slotProps.data.login }}
                        </template>
                    </Column>

                    <Column field="Unidade Consumidora" header="Unidade Consumidora" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Unidade Consumidora</span>
                            {{ slotProps.data.senha }}
                        </template>
                    </Column>

                    <Column field="Qtd. Parcelas" header="Qtd. Parcelas" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Qtd. Parcelas</span>
                            {{ slotProps.data.senha }}
                        </template>
                    </Column>

                    <Column field="Valor Total Contrato" header="Valor Total Contrato" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Valor Total Contrato</span>
                            {{ slotProps.data.senha }}
                        </template>
                    </Column>

                    <Column field="Parcelas" header="Parcelas" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <Button class="p-button-info" @click.prevent="dadosBancarios(slotProps.data.id, slotProps.data)" icon="pi pi-eye" @click="visible2 = true" />
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
