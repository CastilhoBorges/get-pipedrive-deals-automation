import 'dotenv/config'

export async function getPipeline(baseUrl, apiKey) {
  const pipelinesUrl = new URL(`${baseUrl}/pipelines`);
  pipelinesUrl.searchParams.append('api_token', apiKey);
  const pipelinesRes = await fetch(pipelinesUrl);

  if (!pipelinesRes.ok) {
    throw new Error(`Erro ao buscar pipelines: ${pipelinesRes.status}`);
  }

  const pipelines = await pipelinesRes.json();

  const pipeline = pipelines.data.filter((pipeline) => {
    if (pipeline.name === process.env.PIPELINE_NAME) {
      return pipeline;
    }
  });

  return pipeline[0].id;
}
