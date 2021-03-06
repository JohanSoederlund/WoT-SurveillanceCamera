"use strict";

const Router = require("koa-router");
const jwt = require('jsonwebtoken');
const decode = require('koa-jwt-decode');

const websocket = require("./websocket");
let actions = require("../models/actions")
let model = require("../models/model")
let properties = require("../models/properties")
let things = require("../models/things")

const SECRET = process.env.SECRET;
const URL = process.env.URL;
const PASSWORD = process.env.PASSWORD;
const router = new Router();

let clients = [];
/**
 * pub/sub /properties/camera
 */
websocket.io.on('connection', (client) => {
  client.on('camera', token => { 
    var decoded = jwt.verify(token, SECRET);
    if (decoded.admin) {
        cli = client;
        clients.push(client);
    }
});

  client.on('disconnect', () => {
    for (var key in clients) {
      if (clients[key] === client.id) {
        delete clients[key];
        break;
      } 
    }
  });
});

/**
 * wot camera took new picture.
 * Sends to connected clients with updated properties
 */
function sendToWebsocketClients(data) {
    properties[0].values.timestamp = data[0].filename;
    properties[1].values.timestamp = data[0].filename;
    clients.forEach( client => {
        client.emit("camera", data);
    })
    //websocket.io.sockets.clients().sockets[clients[username]].emit("notification", createCommit(data) );
}

/**
 * Every route below.
 * WoT model
 */
router.get("/", async function (ctx) {
    ctx.response.status = 200;
    ctx.set('Link', URL);
    ctx.body = {
      links: {_self: URL+"/", login: URL+"/login", actions: URL+"/actions", properties: URL+"/properties", things: URL+"/things"},
      model: model
    };
});

router.get("/properties", decode({ secret: SECRET }), async function (ctx) {
    ctx.response.status = 200;
    ctx.set('Link', URL);
    ctx.body = {
      links: {_self: URL+"/properties", login: URL+"/login", actions: URL+"/actions", model: URL+"/", things: URL+"/things"},
      properties: properties
    };
});

router.get("/actions", decode({ secret: SECRET }), async function (ctx) {
    ctx.response.status = 200;
    ctx.set('Link', URL);
    ctx.body = {
      links: {_self: URL+"/actions", login: URL+"/login", properties: URL+"/properties", model: URL+"/", things: URL+"/things"},
      actions: actions
    };
});

router.post("/actions", async function (ctx) {
    ctx.response.status = 204;
    ctx.set('Link', URL+"/actions");
});

router.get("/things", async function (ctx) {
    ctx.response.status = 204;
    ctx.set('Link', URL+"/things");
    ctx.body = {
        links: {_self: URL+"/things", login: URL+"/login", actions: URL+"/actions", model: URL+"/", properties: URL+"/properties"},
        things: things
      };
});

router.post("/login", async function (ctx) {
    ctx.set('Link', URL+"/login");
    if(ctx.request.body.password === PASSWORD) {
        ctx.response.status = 200;
        let token = jwt.sign({ admin: true }, SECRET, {expiresIn: '62d'})
        ctx.body = {
            links: {_self: URL+"/login", actions: URL+"/actions", model: URL+"/", properties: URL+"/properties", things: URL+"/things"},
            accessToken: token
        };
    } else {
        ctx.response.status = 401;
    }
    
});

//export default router;
module.exports = {
    router,
    sendToWebsocketClients
}