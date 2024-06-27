const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xpbmsuZ3J1cG9yaWFsbWEuY29tLmJyL2FwaS9hdXRlbnRpY2FjYW8vbG9naW4iLCJpYXQiOjE3MTk0MjY0NTAsIm5iZiI6MTcxOTQyNjQ1MCwianRpIjoiR3Zaa0V4S1p1Y1pCeG83ZyIsInN1YiI6IjIiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.DwKZOPzD4SCxvaBydCj9bfqyFtI12cmq6rGpkW7P0aA';

export default class LinkService {
    async buscaGerentes() {
        return await fetch(`https://link.gruporialma.com.br/api/externo/listar-gerentes`, {
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

    async buscaDiretores() {
        return await fetch(`https://link.gruporialma.com.br/api/externo/listar-diretores`, {
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

    async buscaPresidentes() {
        return await fetch(`https://link.gruporialma.com.br/api/externo/listar-presidentes`, {
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

    async buscaEmpresas() {
        return await fetch(`https://link.gruporialma.com.br/api/externo/listar-empresas`, {
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

    async buscaLocais() {
        return await fetch(`https://link.gruporialma.com.br/api/externo/listar-locais`, {
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

    async buscaStatus(id) {
        return await fetch(`https://link.gruporialma.com.br/api/externo/consultar-status/${id}`, {
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

    comFluxo(form) {
        console.log(form);
        const formData = new FormData();
        formData.append('descricao', form?.descricao ?? null);
        formData.append('valor', form?.valor ?? null);
        formData.append('urgente', form?.urgente ? form.urgente : 0);
        formData.append('dt_vencimento', this.formatarDataParaYMD(form?.dt_vencimento));
        formData.append('anexo', form?.pdf ?? null);
        formData.append('id_link', form?.link?.id ?? null);
        formData.append('id_empresa', form?.empresa?.id ?? null);
        formData.append('id_local', form?.local?.id ?? null);
        formData.append('email', localStorage.getItem('email'));
        formData.append('protheus', form?.protheus);

        // Crie um array de objetos com a chave "id_usuario"
        const usuarios = form.fluxo.map((item) => ({ id_usuario: item.id }));

        // Adicione o array de objetos ao FormData
        formData.append('fluxo', JSON.stringify(usuarios));

        return fetch(`https://link.gruporialma.com.br/api/externo/cadastrar-pedido`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: formData
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

    formatarDataParaYMD(data) {
        if (data) {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa do zero, então somamos 1
            const ano = data.getFullYear();

            return `${ano}-${mes}-${dia}`;
        } else {
            return `0000-00-00`;
        }
    }
}
