<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import AutenticacaoService from '../../../service/AutenticacaoService';
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            toast: new useToast(),
            displayConfirmation: ref(false),
            empresaService: new AutenticacaoService(),
            router: useRouter(),
            email: ref(null),
            password: ref(null),
            message: ref([]),
            count: ref(0),
            form: ref({})
        };
    },
    methods: {
        login() {
            this.empresaService.login(this.form).then((data) => {
                if (data.Response == 'Usuário ou senha inválidos!') {
                    this.addMessage('error');
                } else {
                    // Acessando dados da resposta
                    const token = data.Response.Token;
                    const user = data.Response.User[0];
                    const id = user.id;
                    const name = user.user_name;
                    const email = user.email;

                    // Salva no localStorage os dados do usuário
                    localStorage.clear();
                    localStorage.setItem('token', token);
                    localStorage.setItem('id', id);
                    localStorage.setItem('name', name);
                    localStorage.setItem('email', email);

                    // Redireciona para login
                    this.router.push('/'); // Mandando para tela principal
                }
            });
        },

        addMessage(type) {
            if (type === 'success') {
                this.message = [{ severity: 'success', detail: 'Mensagem de sucesso!', content: 'Autenticação feita com sucesso!', id: this.count++ }];
            } else if (type === 'error') {
                this.message = [{ severity: 'error', detail: 'Mensagem de erro!', content: 'Usuário ou senha inválidos!', id: this.count++ }];
            }
        }
    }
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #3b82f6 10%, rgba(999, 999, 999, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Sistema de Controle de Pagamentos</div>
                    </div>

                    <transition-group name="p-message" tag="div">
                        <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }} </Message>
                    </transition-group>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Digite seu e-mail" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="form.email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Senha</label>
                        <Password id="password1" v-model="form.senha" placeholder="Digite sua senha..." :feedback="false" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5"></div>
                        <Button @click.prevent="login()" label="Entrar" severity="info" class="w-full p-3 text-xl"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
