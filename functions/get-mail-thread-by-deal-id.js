export async function getMailThreadByDealId(baseUrl, apiKey) {
  const mailThreadUrl = new URL(`${baseUrl}/mailbox/mailThreads`);
  mailThreadUrl.searchParams.append('api_token', apiKey);
  mailThreadUrl.searchParams.append('folder', 'inbox');

  const mailThreadRes = await fetch(mailThreadUrl);

  const mailThread = await mailThreadRes.json();

  return mailThread.data;
}
