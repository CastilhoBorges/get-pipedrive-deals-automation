import 'dotenv/config';
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
    const pipelineId = await getPipeline(
      PIPEDRIVE_BASE_URL_V2,
      PIPEDRIVE_API_KEY
    );

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

    const dealFields = await getDealFields(
      PIPEDRIVE_BASE_URL_V1,
      PIPEDRIVE_API_KEY
    );

    // Tenho que melhorar aqui, para deixar de forma customizavel
    const resume = {
      'Mapear | Sem prévia': [],
      'Form preenchido': [],
      Qualificar: [],
      'Personalização | Proposta comercial': [],
      'Visita técnica': [],
      'Etapa de negociação': [],
      Fechamento: [],
    };

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

        const stage = stageTable[stage_id];

        const person = await getPersonById(
          person_id,
          PIPEDRIVE_BASE_URL_V2,
          PIPEDRIVE_API_KEY
        );

        const organization = await getOrganizationById(
          org_id,
          PIPEDRIVE_BASE_URL_V2,
          PIPEDRIVE_API_KEY
        );

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
          personName: person.name,
          organization: organization.name,
          commercialProposal: formatedCustomFields,
          entryDate: add_time,
          lastUpdate: update_time,
          activities: activitiesFormated,
          notes: notesFormated,
        });
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(resume),
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erro ao processar a requisição.',
        error: error.message,
      }),
    };
  }
};
