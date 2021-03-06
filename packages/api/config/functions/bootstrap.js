'use strict';

const socket = require('socket.io');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

const isStaging = process.env.NODE_ENV === 'staging' ? true : false;
const isProduction = process.env.NODE_ENV === 'production' ? true : false;

module.exports = () => {
  var io = socket(strapi.server, {
    cors: {
      origin: (isProduction && 'https://platonist.de') || (isStaging && 'https://staging.platonist.de') || 'http://localhost:3000',
    }
  });
  const clients = [];
  const typingUsers = [];

  io.on('connection', function(socket){
    
    // TODO - Change ID
    socket.user_id = (Math.random() * 100000000000000);
    clients.push(socket);
    
    socket.on('disconnect', () => {
      // Remove client on disconnect
      clients.forEach((client, index) => {
        if (client.user_id === socket.user_id) {
          clients.splice(index, 1);
        }
      });
    });
    socket.on("typing", (data) => {
      // console.log(data);
      const { user } = data;
      if (data.comment.comment.value.length > 5) {
        if (!typingUsers.find(u => u.user.username === user.username)) {
          typingUsers.push(data);
        } else {
          const index = typingUsers.indexOf(ele => ele.user.username === user.username);
          if (index > 0) {
            typingUsers[index] = data;
          }
        }
        io.emit("typing", {
          typingUsers: typingUsers
        });
      } else {
        
        const index = typingUsers.indexOf(ele => ele.user.username === user.username);
        typingUsers.splice(index, 1);
        io.emit("typing", {
          typingUsers: typingUsers
        });
      }
    })
  });
  
  const models = [];
  
  Object.keys(strapi.models).forEach(key => {
    if (key !== 'core_store' && key !== 'strapi_webhooks') {
      models.push(key);
    }
  }); 
  
  strapi.io = io;
  strapi.emitSocket = {};
  
  models.forEach(model => {
    Object.assign(strapi.emitSocket, {
      [model]: {
        create: data => io.emit(`${model}.create`, data),
        delete: data => io.emit(`${model}.delete`, data),
        update: data => io.emit(`${model}.update`, data),
      }, 
    });
  });
};
