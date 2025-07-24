export async function getDealsByPipelineId(pipelineId, baseUrl, apiKey) {
  const dealsUrl = new URL(`${baseUrl}/deals`);
  dealsUrl.searchParams.append('api_token', apiKey);
  dealsUrl.searchParams.append('pipeline_id', pipelineId);
  dealsUrl.searchParams.append('status', 'open');

  const dealsRes = await fetch(dealsUrl);

  const deals = await dealsRes.json();

  return deals.data;
}
