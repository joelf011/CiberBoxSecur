/**
 * Controlador de conteúdos CMS (Content Management System).
 *
 * Responsável por:
 * - Obter o conteúdo da página inicial (Home) para a área pública e backoffice.
 * - Permitir ao administrador atualizar os textos da Home via upsert.
 *
 * Fluxo:
 * Frontend (React) -> Rota Express -> Controller -> cmsService (getPageBySlug / upsertPageContent) -> Base de Dados -> Resposta JSON.
 */
const pageService = require("../services/cmsService");

// Obtém o conteúdo da Home identificado pelo slug "home".
// Devolve apenas o content_body (JSON com os textos) que o React consome diretamente.
const getHomeContent = async (req, res) => {
  try {
    const page = await pageService.getPageBySlug("home");

    // Se a página ainda não existir na BD, devolve objeto vazio para o frontend tratar.
    if (!page) {
      return res
        .status(200)
        .json({});
    }

    // Devolve apenas o JSON com os textos, sem metadados da página.
    res.status(200).json(page.content_body);
  } catch (error) {
    console.error("Erro ao buscar conteúdo da home:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Guarda as alterações enviadas pelo administrador ao conteúdo da Home.
// Utiliza upsert: cria a página se não existir, ou atualiza se já existir.
const updateHomeContent = async (req, res) => {
  try {
    const contentBody = req.body;
    // Identifica o autor da alteração a partir do token de autenticação.
    const authorId = req.user.id;

    const updatedPage = await pageService.upsertPageContent(
      "home",
      contentBody,
      authorId,
    );

    res.status(200).json({
      message: "Conteúdo atualizado com sucesso!",
      data: updatedPage.content_body,
    });
  } catch (error) {
    console.error("Erro ao atualizar conteúdo da home:", error);
    res.status(500).json({ error: "Erro ao guardar as alterações." });
  }
};

module.exports = {
  getHomeContent,
  updateHomeContent,
};
