import { google } from 'googleapis';

export async function saveToGoogleDocs(data, credentials) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: credentials,
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    const docs = google.docs({ version: 'v1', auth });
    const drive = google.drive({ version: 'v3', auth });

    // Criar novo documento
    const createResponse = await docs.documents.create({
      resource: {
        title: `Pipeline Report - ${new Date().toISOString().split('T')[0]}`,
      },
    });

    const documentId = createResponse.data.documentId;
    console.log(`📄 Documento criado: ${documentId}`);

    // Preparar conteúdo do relatório
    let content = `RELATÓRIO DO PIPELINE - ${new Date().toLocaleDateString(
      'pt-BR'
    )}\n\n`;

    content += `ESTATÍSTICAS GERAIS:\n`;
    content += `• Total de Deals: ${data.metadata.totalDeals}\n`;
    content += `• Organizações Encontradas: ${data.metadata.organizationsFound}\n`;
    content += `• Organizações Não Encontradas: ${data.metadata.organizationsNotFound}\n`;
    content += `• Pipeline ID: ${data.metadata.pipelineId}\n\n`;

    content += `DETALHAMENTO POR ESTÁGIO:\n\n`;

    Object.entries(data.data).forEach(([stage, deals]) => {
      content += `${stage.toUpperCase()} (${deals.length} deals):\n`;

      deals.forEach((deal, index) => {
        content += `  ${index + 1}. ${deal.personName}\n`;
        content += `     Organização: ${deal.organization}\n`;
        content += `     Data de Entrada: ${new Date(
          deal.entryDate
        ).toLocaleDateString('pt-BR')}\n`;
        content += `     Última Atualização: ${new Date(
          deal.lastUpdate
        ).toLocaleDateString('pt-BR')}\n`;
        content += `     Atividades: ${deal.activities?.length || 0}\n`;
        content += `     Notas: ${deal.notes?.length || 0}\n\n`;
      });

      content += '\n';
    });

    // Inserir conteúdo no documento
    await docs.documents.batchUpdate({
      documentId,
      resource: {
        requests: [
          {
            insertText: {
              location: {
                index: 1,
              },
              text: content,
            },
          },
        ],
      },
    });

    // Compartilhar documento (opcional)
    await drive.permissions.create({
      fileId: documentId,
      resource: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const documentUrl = `https://docs.google.com/document/d/${documentId}`;
    console.log(`✅ Relatório criado: ${documentUrl}`);

    return {
      documentId,
      url: documentUrl,
    };
  } catch (error) {
    console.error('❌ Erro ao criar Google Doc:', error);
    throw error;
  }
}
