export async function getPersonById(id, baseUrl, apiKey) {
  const personUrl = new URL(`${baseUrl}/persons/${id}`);
  personUrl.searchParams.append('api_token', apiKey);

  const personRes = await fetch(personUrl);

  const person = await personRes.json();

  return person.data;
}
