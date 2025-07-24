export async function getOrganizationById(id, baseUrl, apiKey) {
  const organizationURl = new URL(`${baseUrl}/organizations/${id}`);
  organizationURl.searchParams.append('api_token', apiKey);

  const organizationRes = await fetch(organizationURl);

  const organization = await organizationRes.json();

  return organization.data;
}
