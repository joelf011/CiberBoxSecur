const pageService = require("../services/cmsService");

// Vai buscar o conteúdo para mostrar na Home Pública e no Backoffice
const getHomeContent = async (req, res) => {
  try {
    const page = await pageService.getPageBySlug("home");

    if (!page) {
      return res
        .status(200)
        .json({});
    }

    // Devolvemos apenas o JSON com os textos, que é o que o React precisa
    res.status(200).json(page.content_body);
  } catch (error) {
    console.error("Erro ao buscar conteúdo da home:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Guarda as alterações enviadas pelo Admin
const updateHomeContent = async (req, res) => {
  try {
    const contentBody = req.body;
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
