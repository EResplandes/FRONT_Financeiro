<script>
import { ref } from 'vue';
import DashboardService from '../service/DashboardService';

export default {
    data() {
        return {
            dashboardService: new DashboardService(),
            informacoes: ref(null)
        };
    },

    mounted: function () {
        // Metódo responsável por buscar todas as fornecedores
        this.dashboardService.listarInformacoes().then((data) => {
            console.log(data);
            this.informacoes = data.informacoes;
        });
    },

    methods: {}
};
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6" v-for="(info, index) in informacoes" :key="index">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">{{ info.empresa }}</span>
                        <div class="text-900 font-medium text-xl">Total de Contratos:</div>
                        <div class="text-900 font-medium text-xl">{{ info.total_projetos }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-book text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ info.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }} </span>
            </div>
        </div>

        <Fieldset>
            <template #legend>
                <div class="flex align-items-center pl-2">
                    <Avatar image="https://media.licdn.com/dms/image/C4E03AQFgSYhROpDDDw/profile-displayphoto-shrink_400_400/0/1653436652339?e=1721260800&v=beta&t=vcwxnYiXNqI7Zr1sYy3RMGFT1YKIabgTnzsubpZ4xuI" shape="circle" />
                    <span class="font-bold p-3">Eduardo C. Resplandes | Desenvolvedor FullStack</span>
                </div>
            </template>
            <h6 class="">Bem-vindos ao Sistema de Controle de Contratos!</h6>
            <hr />
            <br />
            <p class="m-0">É com grande entusiasmo que damos as boas-vindas a todos os usuários ao Sistema de Controle de Contrato!</p>
            <br />
            <p class="m-0">
                Neste momento, gostaríamos de informar que o Sistema de Controle de Contrato está em fase de testes. Como resultado, é possível que você encontre alguns pequenos contratempos ou erros durante a sua navegação. Pedimos, por gentileza,
                que nos ajude a aprimorar ainda mais essa ferramenta, reportando qualquer problema que encontrar.
            </p>
            <br />
            <p class="m-0">Para relatar erros ou enviar sugestões de melhoria, por favor, entre em contato conosco através dos seguintes meios:</p>
            <br />
            <p class="m-0">Telefone: Ramal +55 61 3298-8817</p>
            <p class="m-0">E-mail: ti@gruporialma.com.br</p>
            <br />
            <p class="m-0">
                Sua colaboração é fundamental para garantir que o Sistema de Controle de Contrato atinja todo o seu potencial e ofereça a melhor experiência possível aos nossos usuários. Agradecemos antecipadamente pela sua ajuda e compreensão
                durante esta fase de testes.
            </p>
            <br />
            <p class="m-0">Estamos ansiosos para ouvir seus feedbacks e trabalhar juntos para tornar o Sistema de Controle de Contrato ainda melhor!</p>
        </Fieldset>
    </div>
</template>
