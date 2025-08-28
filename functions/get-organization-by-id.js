export async function getOrganizationById(id, baseUrl, apiKey) {
  if (!id || id === null || id === undefined) {
    console.log(`⚠️ ID da organização inválido: ${id}`);
    return null;
  }

  try {
    const organizationURl = new URL(`${baseUrl}/organizations/${id}`);
    organizationURl.searchParams.append('api_token', apiKey);

    console.log(`🔍 Buscando organização ID: ${id}`);

    const organizationRes = await fetch(organizationURl);

    if (!organizationRes.ok) {
      console.error(
        `❌ Erro HTTP ao buscar organização ${id}: ${organizationRes.status} - ${organizationRes.statusText}`
      );

      if (organizationRes.status === 404) {
        console.log(`📭 Organização ${id} não encontrada (404)`);
        return null;
      }

      if (organizationRes.status === 403) {
        console.log(`🔒 Sem permissão para acessar organização ${id} (403)`);
        return null;
      }

      throw new Error(
        `HTTP ${organizationRes.status}: ${organizationRes.statusText}`
      );
    }

    const organization = await organizationRes.json();

    if (!organization) {
      console.error(`❌ Resposta vazia da API para organização ${id}`);
      return null;
    }

    if (organization.success === false) {
      console.error(
        `❌ API retornou success: false para organização ${id}:`,
        organization.error
      );
      return null;
    }

    if (!organization.data) {
      console.log(`📭 Dados da organização ${id} não encontrados`);
      return null;
    }

    console.log(
      `✅ Organização encontrada: ${organization.data.name} (ID: ${id})`
    );
    return organization.data;
  } catch (error) {
    console.error(`💥 Erro ao buscar organização ${id}:`, error.message);

    // Se for erro de rede, tentar novamente uma vez
    if (error.message.includes('fetch')) {
      console.log(`🔄 Tentando novamente organização ${id}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const organizationURl = new URL(`${baseUrl}/organizations/${id}`);
        organizationURl.searchParams.append('api_token', apiKey);

        const organizationRes = await fetch(organizationURl);

        if (organizationRes.ok) {
          const organization = await organizationRes.json();
          if (organization.success && organization.data) {
            console.log(
              `✅ Organização encontrada na segunda tentativa: ${organization.data.name}`
            );
            return organization.data;
          }
        }
      } catch (retryError) {
        console.error(
          `💥 Falha na segunda tentativa para organização ${id}:`,
          retryError.message
        );
      }
    }

    return null;
  }
}
