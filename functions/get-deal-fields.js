export async function getDealFields(baseUrl, apiKey) {
  const dealFieldsURl = new URL(`${baseUrl}/dealFields`);
  dealFieldsURl.searchParams.append('api_token', apiKey);

  const dealFieldsRes = await fetch(dealFieldsURl);

  const dealFields = await dealFieldsRes.json();

  return dealFields.data;
}
