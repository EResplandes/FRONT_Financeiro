import jsPDF from 'jspdf';
import 'jspdf-autotable';
import rialmaImg from '../../../../public/assets/img/rialma.png'; // Importa a imagem diretamente

// Função para adicionar um zero à esquerda para valores menores que 10
function pad(valor) {
    return valor < 10 ? '0' + valor : valor;
}

// Metódo responsável por formatar cnpj
function formatarCNPJ(cnpj) {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, '');

    // Adiciona pontos e traços conforme necessário
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');

    return cnpj;
}

// Obtém a data e hora atual
const dataAtual = new Date();
const dia = pad(dataAtual.getDate());
const mes = pad(dataAtual.getMonth() + 1);
const ano = dataAtual.getFullYear();
const horas = pad(dataAtual.getHours());
const minutos = pad(dataAtual.getMinutes());
const segundos = pad(dataAtual.getSeconds());

// Formata a data e hora como uma string
const dataHoraFormatada = `${dia}/${mes}/${ano} às ${horas}:${minutos}:${segundos}`;

export function generatePDF(informacoes, parcelas) {
    // Cria um novo documento PDF com orientação paisagem (horizontal)
    const doc = new jsPDF('l');

    // Data de Emissão
    doc.setFontSize(8);
    doc.text(`Data de Emissão: ${dataHoraFormatada}`, 220, 13);

    doc.setFontSize(15);
    doc.text(`Contrato nº ${informacoes[0].contrato}`, 130, 15);

    doc.addImage(rialmaImg, 'PNG', 15, 10, 60, 30); // Adiciona a imagem no canto superior esquerdo

    // Adiciona as informações do contrato e fornecedor
    doc.setFontSize(10);

    doc.text(`Fornecedor(a): ${informacoes[0].nome}`, 15, 50);
    doc.text(`Empresa: ${informacoes[0].nome_empresa}`, 15, 60);
    doc.text(`CNPJ Fornecedor: ${formatarCNPJ(informacoes[0].cnpj)}`, 15, 55);

    doc.setFontSize(10);
    doc.text(`Unidade Consumidora: ${informacoes[0].unidade_consumidora}`, 150, 55);

    doc.setFontSize(15);
    doc.text(`PARCELAS`, 135, 80);

    // Adiciona o valor do contrato
    // doc.text(`Valor do Contrato: ${informacoes[0].valor_contrato.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 90, 60);

    // Defina o título da tabela
    const headers = [['Mês Ref.', 'Dt. Vencimento', 'Valor', 'Observação', 'Status']];

    // Formata os dados da tabela
    const tableData = parcelas.map((parcela) => {
        // Converte a data de vencimento para o formato "DD/MM/AAAA"
        const dataVencimento = new Date(parcela.dt_vencimento);
        const dia = String(dataVencimento.getDate()).padStart(2, '0');
        const mes = String(dataVencimento.getMonth() + 1).padStart(2, '0');
        const ano = dataVencimento.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;

        return [parcela.mes_referencia, dataFormatada, parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), parcela.observacao, parcela.status];
    });

    // Adicione a tabela ao documento PDF
    doc.autoTable({
        head: headers,
        body: tableData,
        startY: 90, // Posição Y inicial da tabela
        theme: 'grid', // Estilo da tabela
        headStyles: { fillColor: [2, 79, 147] }, // Cor de fundo do cabeçalho da tabela
        alternateRowStyles: { fillColor: [255, 255, 255] }, // Cor de fundo das linhas alternadas da tabela
        columnStyles: {
            0: { columnWidth: 20 },
            1: { columnWidth: 50 },
            2: { columnWidth: 60 },
            3: { columnWidth: 100 },
            4: { columnWidth: 40 }
        }
    });

    // Salve o documento PDF com o nome 'documento.pdf'
    doc.save('documento.pdf');
}
