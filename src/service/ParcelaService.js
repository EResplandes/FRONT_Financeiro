const token = localStorage.getItem('token');

import API_URL from './config.js';

export default class FornecedorService {
    async cadastrarParcela(form) {
        console.log(this.formatarData(form.dt_vencimento));
        return fetch(`${API_URL}/parcelas/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                fk_contrato: localStorage.getItem('id_contrato'),
                mes_referencia: form.mes_referencia,
                dt_vencimento: this.formatarData(form.dt_vencimento),
                observacao: form.observacao,
                valor_parcela: form.valor_parcela
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

    async excluirParcela(idParcela) {
        return await fetch(`${API_URL}/parcelas/deletar/${idParcela}`, {
            method: 'DELETE',
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

    formatarData(data) {
        const dataObj = new Date(data);
        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se necessário
        const dia = String(dataObj.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário

        return `${ano}-${mes}-${dia}`;
    }
}
