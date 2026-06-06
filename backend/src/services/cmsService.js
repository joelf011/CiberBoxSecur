const { Page } = require("../models");

const getPageBySlug = async (slug) => {
  const page = await Page.findOne({ where: { slug } });
  return page;
};

const upsertPageContent = async (slug, contentBody, authorId) => {
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
