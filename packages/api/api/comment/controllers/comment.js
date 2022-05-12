'use strict';

const { 
  parseMultipartData,
  sanitizeEntity,
} = require('strapi-utils');

const {
  getModel,
  getService,
} = require('../../../lib/utils');

const settings = require('../models/comment.settings.json');

const modelName = settings.info.name;

const countReplies = result => {
  if (!result || result && !result.replies) {
    return 0;
  }

  return result.replies.length;
};

const cleanEntity = entity => {
  entity.meta = {
    debateId: (entity.debate && entity.debate.id) || null,
    moderatorId: (entity.moderator && entity.moderator.id) || null,
    userId: (entity.user && entity.user.id) || null, 
  };

  entity.replyCount = countReplies(entity);

  // delete entity.debate;
  // delete entity.moderator;
  // delete entity.replies;
  
  return entity;
};

const cleanAndSanitizeEntity = (entity, model) => {
  const sanitizedEntity = sanitizeEntity(entity, { 
    model
  });

  return cleanEntity(sanitizedEntity);
};

const resolveReplies = async(replyParent) => {
  const result = new Promise((resolve, reject) => {
    const replies = replyParent.replies.map(reply => new Promise((r) => {
      strapi.plugins["users-permissions"].services.user.fetch({id:reply.user}).then(user => r(user));
    }));
    resolve(replies);        
  });

  const resolved = await Promise.all((await result));
  return resolved;
}

const resolveModerator = async(moderation) => {
  const result = new Promise((resolve, reject) => {
    strapi.plugins["users-permissions"].services.user.fetch({id:moderation.moderator}).then(user => resolve(user))
  });
  return result;
}

module.exports = {

  /**
   * 
   * @param {*} ctx 
   */
  create: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    let entity;
    try { 
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        entity = await service.create(data, { files });
      } else {
        entity = await service.create(ctx.request.body);
      }
    } catch (error) {
      return ctx.badRequest(error);
    }

    return cleanAndSanitizeEntity(entity, model);
  },

  /**
   * 
   * @param {*} ctx 
   */
  delete: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    const { id } = ctx.params;

    const [comment] = await service.find({
      id,
      'user.id': ctx.state.user.role,
    });
    
    let canDelete = false;
    switch (ctx.state.user.role.type) {
      case 'admin':
      case 'moderator':
        canDelete = true;
        break;
      default:
        break;
    }

    if (!comment || !canDelete) {
      return ctx.unauthorized('You can\'t delete this entry');
    }

    const entity = await service.delete({ id });

    if (!entity) {
      return null;
    } 

    return cleanAndSanitizeEntity(entity, model);
  },

  /**
   * 
   * @param {*} ctx 
   */
  find: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    const user = ctx.state && ctx.state.user;

    if (user && user.role && user.role.type) {
      switch (user.role.type.toLowerCase()) {
        case 'admin':
        case 'moderator':
          break;
        default:
          Object.assign(ctx.query, {
            // blocked: false
          });
          break;
      }
    } else {
      Object.assign(ctx.query, {
        // blocked: false
      });
    }

    let entities;
    if (ctx.query._q) {
      entities = await service.search(ctx.query);
    } else {
      entities = await service.find(ctx.query);
    }

    // let sort = "desc";
    // if (ctx.query["_sort"].toLowerCase().includes("desc")) sort = "desc";
    // else sort = "asc";
    // const comments = await strapi.connections.default.raw(
    //   `
    //     select comments.*, u.* from comments
    //     inner join \`users-permissions_user\` as u 
    //     on comments.user = u.id 
    //     where comments.debate = ${ctx.query["debate.id"]} 
    //     order by comments.created_at ${sort}
    //   `
    // );

    let repliesParent = entities.filter(e => e.replies.length > 0);
    let pinnedComments = entities.filter(e => e.moderation && e.moderation.status && e.moderation.status === "pinned");

    const pinnedByModerators = pinnedComments.map(comment => resolveModerator(comment.moderation));
    const resolvedModerators = await Promise.all(pinnedByModerators);

    pinnedComments.forEach((pinned, i) => {
      pinned.moderation.user = resolvedModerators[i];
    });
    
    const arr = []
    repliesParent.forEach(parent => {
      const resolved = resolveReplies(parent);
      arr.push(resolved)
    })
    
    const resolvedUsers = await Promise.all(arr);
    repliesParent.forEach((parent, i) => {
      parent.replies.forEach((reply, j) => {
        reply.user = resolvedUsers[i][j];
      });
    });

    repliesParent.forEach(reply => {
      if (entities.includes(entity => entity.id === reply.id)) {
        const i = entities.findIndex(entity => entity.id === reply.id);
        entities[i] = reply;
      }
    });

    pinnedComments.forEach(comment => {
      if (entities.includes(entity => entity.id === comment.id)) {
        const i = entities.findIndex(entity => entity.id === comment.id);
        entities[i] = comment;
      }
    })

    const sanitizedEntites = entities.map(entity => cleanAndSanitizeEntity(entity, model));
    return sanitizedEntites;
  },

  /**
   * 
   * @param {*} ctx 
   */
  findByUser: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);
    
    const {
      userId
    } = ctx.params;
    
    const query = {
      ...ctx.query,
      user: userId
    };

    const user = ctx.state && ctx.state.user;

    if (user && user.role && user.role.type) {
      switch (user.role.type.toLowerCase()) {
        case 'admin':
        case 'moderator':
          break;
        default:
          Object.assign(query, {
            // blocked: false
          });
          break;
      }
    } else {
      Object.assign(query, {
        // blocked: false
      });
    }

    let entities;

    if (query._q) {
      entities = await service.search(query);
    } else {
      entities = await service.find(query);
    }

    return entities.map(entity => cleanAndSanitizeEntity(entity, model));
  },

  /**
   * 
   * @param {*} ctx 
   */
  findOne: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    const { id } = ctx.params;

    const entity = await service.findOne({ id });

    if (!entity) {
      return null;
    }

    const user = ctx.state && ctx.state.user;
    let blocked = false;
    if (user && user.role && user.role.type) {
      switch (user.role.type.toLowerCase()) {
        case 'admin':
        case 'moderator':
          break;
        default:
          blocked = entity.blocked;
          break;
      }
    } else {
      blocked = entity.blocked;
    }

    if (blocked) {
      throw ctx.notFound();
    }

    return cleanAndSanitizeEntity(entity, model);
  },

  update: async (ctx) => {
    const service = getService(strapi, modelName);
    const model = getModel(strapi, modelName);

    const { id } = ctx.params;
    
    const findQuery = {
      id,
      'user.id': ctx.state.user.id
    };
    
    const user = ctx.state && ctx.state.user;

    if (user && user.role && user.role.type) {
      switch (user.role.type.toLowerCase()) {
        case 'admin':
        case 'moderator':
          break;
        default:
          Object.assign(findQuery, {
            // blocked: false,
            disputed: false,
          });
          break;
      }
    } else {
      Object.assign(findQuery, {
        // blocked: false,
        disputed: false,
      });
    }

    const [comment] = await service.find({ id: findQuery.id });

    if (!comment) {
      return ctx.unauthorized('You can\'t update this entry');
    }

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await service.update({ id }, data, {
        files,
      });
    } else {
      entity = await service.update({ id }, ctx.request.body);
    }

    return cleanAndSanitizeEntity(entity, model);
  },

  count: async (ctx) => {
    const service = getService(strapi, modelName);

    const user = ctx.state && ctx.state.user;

    if (user && user.role && user.role.type) {
      switch (user.role.type.toLowerCase()) {
        case 'admin':
        case 'moderator':
          break;
        default:
          Object.assign(ctx.query, {
            // blocked: false
          });
          break;
      }
    } else {
      Object.assign(ctx.query, {
        // blocked: false
      });
    }

    if (ctx.query._q) {
      return service.countSearch(ctx.query);
    }
    return service.count(ctx.query);
  },
};
