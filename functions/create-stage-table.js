export async function createStageTable(pipelineId, baseUrl, apiToken) {
  const stageTable = {};

  const stagesUrl = new URL(`${baseUrl}/stages`);
  stagesUrl.searchParams.append('api_token', apiToken);
  stagesUrl.searchParams.append('pipeline_id', pipelineId);
  stagesUrl.searchParams.append('sort_by', 'order_nr');

  const stagesRes = await fetch(stagesUrl);
  const stages = await stagesRes.json();

  stages.data.forEach((stage) => {
    const { id, name } = stage;
    stageTable[id] = name;
  });

  return stageTable;
}
