export async function getNotesByDealId(id, baseUrl, apiKey) {
  const notesUrl = new URL(`${baseUrl}/notes`);
  notesUrl.searchParams.append('api_token', apiKey);
  notesUrl.searchParams.append('deal_id', id);

  const notesRes = await fetch(notesUrl);

  const notes = await notesRes.json();

  return notes.data;
}
