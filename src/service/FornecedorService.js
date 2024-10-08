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

    async buscaFornecedores() {
        return await fetch(`${API_URL}/fornecedores/listar`, {
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

    async buscaFornecedoresFiltros(filtros) {
        let url = `${API_URL}/fornecedores/listar-filtros`;

        if (filtros.nome || filtros.nome_fantasia || filtros.cnpj) {
            url += '?';

            if (filtros.nome) {
                url += `nome=${encodeURIComponent(filtros.nome)}&`;
            }

            if (filtros.nome_fantasia) {
                url += `nome_fantasia=${encodeURIComponent(filtros.nome_fantasia)}`;
            }

            if (filtros.cnpj) {
                url += `cnpj=${encodeURIComponent(filtros.cnpj)}`;
            }
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async editarFornecedor(idFornecedor, form) {
        return await fetch(`${API_URL}/fornecedores/editar/` + idFornecedor, {
            method: 'PUT',
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
}
