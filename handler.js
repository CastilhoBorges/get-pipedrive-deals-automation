import 'dotenv/config';
import { writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { getPipeline } from './functions/get-pipeline-by-id.js';
import { createStageTable } from './functions/create-stage-table.js';
import { getDealsByPipelineId } from './functions/get-deals-by-pipeline-id.js';
import { getPersonById } from './functions/get-person-by-id.js';
import { getOrganizationById } from './functions/get-organization-by-id.js';
import { getDealFields } from './functions/get-deal-fields.js';
import { formatCustomFields } from './functions/formated-custom-fields.js';
import { getNotesByDealId } from './functions/get-notes-by-deal-id.js';
import { getActivitiesByDealId } from './functions/get-activities-by-deal-id.js';
import { formatActivities } from './functions/format-activities.js';
import { sleep } from './utils/code-sleep.js';
import { formatNotes } from './functions/format-notes.js';

const { PIPEDRIVE_API_KEY, PIPEDRIVE_BASE_URL_V2, PIPEDRIVE_BASE_URL_V1 } =
  process.env;

export const handler = async () => {
  try {
    console.log('🚀 Iniciando processamento dos deals...');

    const pipelineId = await getPipeline(
      PIPEDRIVE_BASE_URL_V2,
      PIPEDRIVE_API_KEY
    );
    console.log(`📊 Pipeline ID: ${pipelineId}`);

    const stageTable = await createStageTable(
      pipelineId,
      PIPEDRIVE_BASE_URL_V2,
      PIPEDRIVE_API_KEY
    );

    const deals = await getDealsByPipelineId(
      pipelineId,
      PIPEDRIVE_BASE_URL_V2,
      PIPEDRIVE_API_KEY
    );
    console.log(`📋 Total de deals encontrados: ${deals.length}`);

    const dealFields = await getDealFields(
      PIPEDRIVE_BASE_URL_V1,
      PIPEDRIVE_API_KEY
    );

    const resume = {
      'Mapear | Sem prévia': [],
      'Form preenchido': [],
      Qualificar: [],
      'Personalização | Proposta comercial': [],
      'Visita técnica': [],
      'Etapa de negociação': [],
      Fechamento: [],
    };

    // Contadores para estatísticas
    let organizationsNotFound = 0;
    let organizationsFound = 0;
    let processedDeals = 0;

    await Promise.all(
      deals.map(async (deal) => {
        const {
          id,
          person_id,
          org_id,
          stage_id,
          custom_fields,
          add_time,
          update_time,
        } = deal;

        console.log(
          `\n📦 Processando Deal ${id} (${++processedDeals}/${deals.length})`
        );
        console.log(`   org_id: ${org_id} (tipo: ${typeof org_id})`);

        const stage = stageTable[stage_id];

        await sleep(3000);
        const person = await getPersonById(
          person_id,
          PIPEDRIVE_BASE_URL_V2,
          PIPEDRIVE_API_KEY
        );

        await sleep(3000);
        const organization = await getOrganizationById(
          org_id,
          PIPEDRIVE_BASE_URL_V2,
          PIPEDRIVE_API_KEY
        );

        // Contabilizar organizações
        if (organization) {
          organizationsFound++;
        } else if (org_id) {
          organizationsNotFound++;
          console.log(
            `⚠️ Deal ${id} tem org_id ${org_id} mas organização não foi encontrada`
          );
        }

        const formatedCustomFields = formatCustomFields(
          custom_fields,
          dealFields
        );

        await sleep(3000);
        const notes = await getNotesByDealId(
          id,
          PIPEDRIVE_BASE_URL_V1,
          PIPEDRIVE_API_KEY
        );

        const notesFormated = notes ? formatNotes(notes) : [];

        await sleep(3000);
        const activities = await getActivitiesByDealId(
          id,
          PIPEDRIVE_BASE_URL_V2,
          PIPEDRIVE_API_KEY
        );

        const activitiesFormated = formatActivities(activities);

        resume[stage].push({
          dealId: id,
          organizationId: org_id,
          personName: person?.name || 'Person name não encontrado',
          organization: organization?.name || 'Organização não encontrada',
          commercialProposal: formatedCustomFields,
          entryDate: add_time,
          lastUpdate: update_time,
          activities: activitiesFormated,
          notes: notesFormated,
        });
      })
    );

    // Estatísticas finais
    console.log('\n📊 ESTATÍSTICAS FINAIS:');
    console.log(`   Total de deals processados: ${deals.length}`);
    console.log(`   Organizações encontradas: ${organizationsFound}`);
    console.log(`   Organizações não encontradas: ${organizationsNotFound}`);
    console.log(
      `   Deals sem org_id: ${deals.filter((d) => !d.org_id).length}`
    );

    const dataDir = join(process.cwd(), 'data');
    try {
      mkdirSync(dataDir, { recursive: true });
    } catch (error) {
      // Pasta já existe
    }

    const timestamp = Date.now();
    const uuid = randomUUID();
    const fileName = `${timestamp}_${uuid}.json`;
    const filePath = join(dataDir, fileName);

    // Adicionar metadados ao arquivo
    const finalData = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalDeals: deals.length,
        organizationsFound,
        organizationsNotFound,
        pipelineId,
      },
      data: resume,
    };

    writeFileSync(filePath, JSON.stringify(finalData, null, 2), 'utf8');

    console.log(`\n💾 Arquivo salvo em: ${filePath}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Dados processados e salvos com sucesso',
        filePath: filePath,
        fileName: fileName,
        stats: {
          totalDeals: deals.length,
          organizationsFound,
          organizationsNotFound,
        },
      }),
    };
  } catch (error) {
    console.error('💥 Erro no handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erro ao processar a requisição.',
        error: error.message,
      }),
    };
  }
};
