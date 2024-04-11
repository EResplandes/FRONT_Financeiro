const token = localStorage.getItem('token');

import API_URL from './config.js';

export default class UnidadeService {
    async cadastraUnidade(form) {
        return fetch(`${API_URL}/unidades/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                nome: form.unidade
            })
        })
            .then((res) => res.json())
            .then((d) => {
                console.log(d);
                return d;
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    }

    async buscaUnidades() {
        return await fetch(`${API_URL}/unidades/listar`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            }
        })
            .then((res) => res.json())
            .then((d) => {
                console.log(d);
                return d;
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    }

    async editaUnidade(idEmpresa, form) {
        return await fetch(`${API_URL}/unidades/editar/` + idEmpresa, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                nome: form.unidade,
            })
        })
            .then((res) => res.json())
            .then((d) => {
                console.log(d);
                return d;
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    }
}
