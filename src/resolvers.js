const validSlugKeys = "abcdefghijklmnopqrstuvwxyz0123456789";

const retrieveRandomKey = () => {
  return validSlugKeys[Math.floor(Math.random() * validSlugKeys.length)];
};

const generateSlug = () => {
  return [
    retrieveRandomKey(),
    retrieveRandomKey(),
    retrieveRandomKey(),
    retrieveRandomKey()
  ].join("");
};

const checkSlugExists = async (models, slug) => {
  const existingSlug = await models.Url.findOne({
    where: {
      slug
    }
  });

  return existingSlug;
};

const resolvers = {
  Query: {
    async url(root, { id }, { models }) {
      return models.Url.findByPk(id);
    },
    async allUrls(root, args, { models }) {
      return models.Url.findAll();
    },
    async urlBySlug(root, { slug }, { models }) {
      return models.Url.findOne({
        where: { slug }
      });
    },
    async urlByUrl(root, { url }, { models }) {
      return models.Url.findOne({
        where: { url }
      });
    }
  },
  Mutation: {
    async createUrl(root, { url, slug }, { models }) {
      const existingUrl = await models.Url.findOne({ where: { url } });
      if (existingUrl && (!slug || slug === existingUrl.slug)) {
        return existingUrl;
      }
      if (!slug) {
        // Generate a new unique slug
        let slugExists = false;
        do {
          slug = generateSlug();
          slugExists = await checkSlugExists(models, slug);
        } while (!slugExists);
      } else if (await checkSlugExists(models, slug)) {
        throw new Error("Duplicate Slug");
      }

      return models.Url.create({ url, slug });
    }
  }
};

module.exports = resolvers;
