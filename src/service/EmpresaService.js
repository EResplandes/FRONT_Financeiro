const token = localStorage.getItem('token');

import API_URL from './config.js';

export default class EmpresaService {
    async cadastraEmpresa(form) {
        return fetch(`${API_URL}/empresas/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                empresa: form.empresa,
                cnpj: form.cnpj
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

    async buscaEmpresas() {
        return await fetch(`${API_URL}/empresas/listar`, {
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

    async buscaEmpresasFiltros(filtros) {
        let url = `${API_URL}/empresas/listar-filtros`;

        console.log(filtros);

        if (filtros.empresa || filtros.cnpj) {
            url += '?';

            if (filtros.empresa) {
                url += `empresa=${encodeURIComponent(filtros.empresa)}&`;
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

    async editaEmpresa(idEmpresa, form) {
        return await fetch(`${API_URL}/empresas/editar/` + idEmpresa, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                empresa: form.empresa,
                cnpj: form.cnpj
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
