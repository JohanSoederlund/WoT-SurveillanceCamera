"use strict";

const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const logger = require('koa-logger');
const helmet = require("koa-helmet");
const kJwt = require('koa-jwt');

const router = require("../app/routes");

const surveillanceController = require("/home/pi/SurveillanceCamera/wot/surveillanceController");

const app = new Koa();

const SECRET =  process.env.SECRET;

app.use(BodyParser());
app.use(logger());
app.use(helmet());

const options = {
};


// Custom 401 handling
app.use(function(ctx, next){
    return next().catch((err) => {
      if (401 == err.status) {
        ctx.status = 401;
        ctx.body = 'Protected resource, use Authorization header to get access\n';
      } else {
        throw err;
      }
    });
});

app.use(kJwt({ secret: SECRET }).unless({ path: [/^\//, /^\/login/] }));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, HEAD');
    ctx.set({accept: 'application/json'});
    ctx.set({'Access-Control-Allow-Origin': 'http://localhost:3030'});
    ctx.set({'Access-Control-Allow-Headers': 'content-type'});
    await next();
})

app.use(router.router.routes()).use(router.router.allowedMethods(options));

app.listen(process.env.PORT || 3000);
