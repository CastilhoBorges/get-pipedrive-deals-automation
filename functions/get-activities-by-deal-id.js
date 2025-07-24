export async function getActivitiesByDealId(id, baseUrl, apiKey) {
  const activitiesUrl = new URL(`${baseUrl}/activities`);
  activitiesUrl.searchParams.append('api_token', apiKey);
  activitiesUrl.searchParams.append('deal_id', id);

  const activitiesRes = await fetch(activitiesUrl);

  const activities = await activitiesRes.json();

  return activities.data;
}
