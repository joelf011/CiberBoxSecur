const { Page } = require("../models");

/**
 * Responsável por:
 * - Ler e gravar conteúdos editáveis do website institucional.
 * - Guardar o JSON produzido no backoffice para consumo pela homepage.
 *
 * Fluxo:
 * CmsController -> Service -> Pages(JSONB) -> Frontend público.
 */
const getPageBySlug = async (slug) => {
  // O slug identifica a página editável sem depender do ID da base de dados.
  const page = await Page.findOne({ where: { slug } });
  return page;
};

const upsertPageContent = async (slug, contentBody, authorId) => {
  // Atualiza se existir; cria o registo inicial quando o backoffice guarda pela primeira vez.
  let page = await Page.findOne({ where: { slug } });

  if (page) {
    page.content_body = contentBody;
    page.author_id = authorId;
    await page.save();
  } else {
    page = await Page.create({
      slug,
      title: "Página Inicial",
      content_body: contentBody,
      author_id: authorId,
    });
  }

  return page;
};

module.exports = {
  getPageBySlug,
  upsertPageContent,
};
