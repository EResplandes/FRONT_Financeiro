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
}
