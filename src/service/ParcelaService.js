const token = localStorage.getItem('token');

import API_URL from './config.js';

export default class FornecedorService {
    async cadastraFornecedor(form) {
        return fetch(`${API_URL}/fornecedores/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                nome: form.nome,
                nome_fantasia: form.nome_fantasia,
                cnpj: form.cnpj,
                login: form.login,
                senha: form.senha,
                cod_banco: form.banco,
                agencia: form.agencia,
                conta: form.conta,
                descricao_banco: form.descricao_banco
            })
        })
            .then((res) => res.json())
            .then((d) => {
                return d;
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    }

    async buscaInformacoes(id_contrato) {
        return await fetch(`${API_URL}/contratos/listar-filtros?id_contrato=${id_contrato}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then((res) => res.json())
            .then((d) => {
                return d;
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    }

    async buscaParcelas(id_contrato) {
        return await fetch(`${API_URL}/parcelas/listar/${id_contrato}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then((res) => res.json())
            .then((d) => {
                return d;
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    }
}
