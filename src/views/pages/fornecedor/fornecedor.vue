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
            filtros: ref({}),
            editar: ref(false),
            preloading: ref(true)
        };
    },

    mounted: function () {
        // Metódo responsável por buscar todas as fornecedores
        this.fornecedorService.buscaFornecedores().then((data) => {
            this.fornecedores = data.response;
            this.preloading = false;
        });
    },

    methods: {
        // Metódo responsável por buscar todas fornecedores
        buscaFornecedores() {
            this.preloading = true;
            this.fornecedorService.buscaFornecedores().then((data) => {
                this.fornecedores = data.response;
                this.preloading = false;
            });
        },

        // Metódo responsável por cadastrar fornecedor
        cadastrarFornecedor() {
            this.fornecedorService.cadastraFornecedor(this.form).then((data) => {
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
        },

        buscaFiltros() {
            this.preloading = true;
            this.fornecedorService.buscaFornecedoresFiltros(this.filtros).then((data) => {
                this.fornecedores = data.response;
                this.preloading = false;
                this.showInfo('Filtros aplicados com sucesso!');
            });
        },

        limparFiltro() {
            this.filtros = {};
            this.buscaFornecedores();
        }
    }
};
</script>

<template>
    <div style="z-index: 99" v-if="preloading" class="full-screen-spinner">
        <ProgressSpinner />
    </div>

    <h2 class="titleForm">Módulo de Fornecedores</h2>
    <hr />

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
            <Button @click.prevent="buscaFiltros()" type="button" class="mr-2 mb-2 p-button-info" label="FILTRAR" icon="pi pi-search" />
        </div>

        <div class="field col-12 md:col-2">
            <label for="">Limpar Filtros:</label>
            <Button @click.prevent="limparFiltro()" type="button" class="mr-2 mb-2 p-button-danger" label="LIMPAR FILTROS" icon="pi pi-trash" />
        </div>
    </div>
    <hr />

    <div class="grid">
        <Dialog v-model:visible="visible2" modal header="Dados Bancários" :style="{ width: '50rem' }"
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
                    <label for="empresa">Nome: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <InputText v-model="form.nome" id="unidade" type="text" required />
                </div>

                <div class="field">
                    <label for="empresa">Nome Fantasia: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <InputText v-model="form.nome_fantasia" id="nome_fantasia" type="text" required />
                </div>

                <div class="field">
                    <label for="empresa">CNPJ: <span v-if="this.editar == false" class="obrigatorio">*</span></label>
                    <InputText v-model="form.cnpj" id="cnpj" type="text" required maxlength="14" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" />
                </div>
                <hr />

                <div class="grid">
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.login" id="login" type="text" required placeholder="Login" />
                        </div>
                    </div>
                    <div class="col-12 md:col-6">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.senha" id="senha" type="text" required placeholder="Senha" />
                        </div>
                    </div>
                </div>

                <h5 class="titleForm">Dados Bancários <span v-if="this.editar == false" class="obrigatorio">*</span></h5>

                <div class="grid">
                    <div class="col-12 md:col-4">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.banco" id="senha" type="text" required placeholder="Banco *" />
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.agencia" id="senha" type="text" required placeholder="Agência *" />
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.conta" id="senha" type="text" required placeholder="Conta *" />
                        </div>
                    </div>
                    <div class="col-12 md:col-12">
                        <div class="field-checkbox mb-0">
                            <InputText v-model="form.descricao_banco" id="senha" type="text" required placeholder="Observação *" />
                        </div>
                    </div>
                </div>

                <div class="field">
                    <Button v-if="this.editar == false" @click.prevent="cadastrarFornecedor()" label="Cadastrar" class="mr-2 mb-2 p-button-info" />
                    <Button v-if="this.editar == true" @click.prevent="editaFornecedor()" label="Editar" class="mr-2 mb-2 p-button-info" />
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

                    <Column field="CNPJ" header="CNPJ" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">CNPJ</span>
                            {{ formatarCNPJ(slotProps.data.cnpj) }}
                        </template>
                    </Column>

                    <Column field="Login" header="Login" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Login</span>
                            {{ slotProps.data.login }}
                        </template>
                    </Column>

                    <Column field="Senha" header="Senha" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <span class="p-column-title">Senha</span>
                            {{ slotProps.data.senha }}
                        </template>
                    </Column>

                    <Column field="Dados" header="Dados Bancários" :sortable="true" class="w-2">
                        <template #body="slotProps">
                            <Button @click.prevent="dadosBancarios(slotProps.data.id, slotProps.data)" icon="pi pi-search" class="p-button-secondary" @click="visible2 = true" />
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
