import jsPDF from 'jspdf';
import 'jspdf-autotable';
import rialmaImg from '../../../../public/assets/img/rialma.png'; // Importa a imagem diretamente

export function generatePDF(informacoes, parcelas) {
    // Cria um novo documento PDF com orientação paisagem (horizontal)
    const doc = new jsPDF('l');

    // Adiciona o cabeçalho com o nome e imagem da empresa do diretório público
    doc.addImage(rialmaImg, 'PNG', 10, 10, 50, 30); // Adiciona a imagem no canto superior esquerdo

    // Adiciona as informações do contrato e fornecedor
    doc.text(`Nº Contrato: ${informacoes[0].contrato}`, 120, 30);
    doc.text(`CNPJ Fornecedor: ${informacoes[0].cnpj}`, 30, 50);

    // Adiciona as informações da unidade consumidora e empresa
    doc.text(`${informacoes[0].unidade_consumidora}`, 80, 45);
    doc.text(`Empresa Fornecedora: ${informacoes[0].nome}`, 70, 60);
    doc.text(`Empresa: ${informacoes[0].nome_empresa}`, 70, 75);

    // Adiciona o valor do contrato
    doc.text(`Valor do Contrato: ${informacoes[0].valor_contrato}`, 90, 90);

    // Defina o título da tabela
    const headers = [['Mês Referência', 'Data Vencimento', 'Observação', 'Status', 'Valor']];

    // Formata os dados da tabela
    const tableData = parcelas.map((parcela) => {
        // Converte a data de vencimento para o formato "DD/MM/AAAA"
        const dataVencimento = new Date(parcela.dt_vencimento);
        const dia = String(dataVencimento.getDate()).padStart(2, '0');
        const mes = String(dataVencimento.getMonth() + 1).padStart(2, '0');
        const ano = dataVencimento.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;

        return [parcela.mes_referencia, dataFormatada, parcela.observacao, parcela.status, `R$ ${parcela.valor}`];
    });

    // Adicione a tabela ao documento PDF
    doc.autoTable({
        head: headers,
        body: tableData,
        startY: 100 // Posição Y inicial da tabela
    });

    // Salve o documento PDF com o nome 'documento.pdf'
    doc.save('documento.pdf');
}
