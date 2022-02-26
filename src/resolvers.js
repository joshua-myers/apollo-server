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
  ].join();
};

const slugExists = async (models, slug) => {
  return !!(
    await models.Url.findOne({
      where: {
        slug
      }
    })
  ).length;
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
        where: {
          slug
        }
      });
    }
  },
  Mutation: {
    async createUrl(root, { url, slug }, { models }) {
      if (!slug) {
        // Generate a new unique slug
        let slugExists = false;
        do {
          slug = generateSlug();
          slugExists = slugExists(models, slug);
        } while (!slugExists);
      } else if (slugExists(models, slug)) {
        return { error: { code: 1, message: "Duplicate Slug" } };
      }

      return models.Url.create(url, slug);
    }
  }
};

module.exports = resolvers;
