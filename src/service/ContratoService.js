import API_URL from './config.js';
const token = localStorage.getItem('token');

export default class ContratoService {
    async buscaContratos() {
        return await fetch(`${API_URL}/contratos/listar`, {
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

    async buscaContratoFil(filtros) {
        let servico = filtros.servico;
        let id_empresa = filtros.empresa.id;

        let url = `${API_URL}/contratos/listar-filtros`;

        if (servico || id_empresa) {
            url += '?';

            if (servico) {
                url += `servico=${encodeURIComponent(servico)}&`;
            }

            if (id_empresa) {
                url += `id_empresa=${encodeURIComponent(id_empresa)}`;
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

    async cadastrarContrato(form) {
        console.log(this.formatarData(form.data_vencimento));
        return fetch(`${API_URL}/contratos/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                servico: form.servico,
                contrato: form.contrato,
                fk_unidade: form.id_unidade,
                fk_empresa: form.id_empresa,
                fk_fornecedor: form.id_fornecedor,
                qtd_parcelas: form.qtd_parcelas,
                valor_contrato: form.valor_contrato,
                parcela_automatica: form.parcela_automatica,
                mes_referencia: form.mes_referencia,
                data_vencimento: this.formatarData(form.data_vencimento)
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

    formatarData(data) {
        const dataObj = new Date(data);
        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda se necessário
        const dia = String(dataObj.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário

        return `${ano}-${mes}-${dia}`;
    }
}
