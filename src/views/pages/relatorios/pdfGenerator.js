import jsPDF from 'jspdf';
import 'jspdf-autotable';
import rialmaImg from '../../../../public/assets/img/rialma.png'; // Importa a imagem diretamente

// Função para adicionar um zero à esquerda para valores menores que 10
function pad(valor) {
    return valor < 10 ? '0' + valor : valor;
}

// Método responsável por formatar CNPJ
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
    doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
    doc.text(`DATA DE EMISSÃO: ${dataHoraFormatada}`, 220, 13);

    doc.setFontSize(15);
    doc.text(`CONTRATO Nº ${informacoes[0].contrato}`, 130, 15);

    doc.addImage(rialmaImg, 'PNG', 15, 10, 40, 20); // Adiciona a imagem no canto superior esquerdo

    // Adiciona a seção com borda para as informações do fornecedor
    const startX = 0;
    const startY = 35;
    const width = 800;
    const height = 20;

    // Desenha um retângulo ao redor das informações
    doc.rect(startX, startY, width, height);

    // Adiciona as informações do contrato e fornecedor
    doc.setFontSize(10);
    doc.text(`FORNECEDOR(a):`, 15, 42);
    doc.setFont('helvetica', 'normal'); // Restaura a fonte normal
    doc.text(informacoes[0].nome, 47, 42);

    doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
    doc.text(`CNPJ:`, 15, 47);
    doc.setFont('helvetica', 'normal'); // Restaura a fonte normal
    doc.text(formatarCNPJ(informacoes[0].cnpj), 47, 47);

    doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
    doc.text(`EMPRESA:`, 15, 52);
    doc.setFont('helvetica', 'normal'); // Restaura a fonte normal
    doc.text(informacoes[0].nome_empresa, 47, 52);

    doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
    doc.setFontSize(10);
    doc.text(`UNIDADE CONSUMIDORA:`, 150, 42);
    doc.setFont('helvetica', 'normal'); // Restaura a fonte normal
    doc.text(informacoes[0].unidade_consumidora, 198, 42);

    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
    doc.text(`PARCELAS`, 135, 67);

    // Defina o título da tabela
    const headers = [['MÊS REF.', 'DT. VENCIMENTO', 'VALOR', 'OBSERVAÇÃO', 'STATUS']];

    // Formata os dados da tabela
    const tableData = parcelas.map((parcela) => {
        // Converte a data de vencimento para o formato "DD/MM/AAAA"
        const dataVencimento = new Date(parcela.dt_vencimento);
        const dia = String(dataVencimento.getDate()).padStart(2, '0');
        const mes = String(dataVencimento.getMonth() + 1).padStart(2, '0');
        const ano = dataVencimento.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;

        return [parcela.mes_referencia, dataFormatada, parseFloat(parcela.valor)?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), parcela.observacao ? parcela.observacao : 'N/C', parcela.status];
    });

    // Calcula o valor total das parcelas
    doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
    const valorTotal = parcelas.reduce((total, parcela) => total + parcela.valor, 0);

    // Adiciona a linha com o valor total ao final do tableData
    tableData.push(['', '', '', 'VALOR TOTAL', valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })]);

    // Adicione a tabela ao documento PDF
    doc.autoTable({
        head: headers,
        body: tableData,
        startY: 77, // Posição Y inicial da tabela
        theme: 'grid', // Estilo da tabela
        headStyles: {
            fillColor: [2, 79, 147],
            halign: 'center' // Centraliza o texto no cabeçalho
        },
        bodyStyles: {
            halign: 'center',
            valign: 'middle' // Centraliza o texto verticalmente no corpo da tabela
        },
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
