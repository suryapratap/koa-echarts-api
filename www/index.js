"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("koa-router");
const body = require("koa-body");
const logger = require("koa-logger");
const middleware_1 = require("./middleware");
dotenv_1.config({ path: path_1.resolve(process.cwd(), ".env") });
// console.log(`getting config from ${process.cwd()}\\.env`);
const app = new Koa();
const router = new Router();
const env = process.env;
app.use(middleware_1.errorHandler);
app.use(body({ multipart: true }));
app.use(logger());
app.use(cors());
router.post('/chart/:type/:height/:width', middleware_1.getImage);
app.on('error', (err, ctx) => {
    console.log('server error', err, ctx);
});
app.on('log', (log, ctx) => {
    console.log('log entry -> ', log);
});
app.use(router.routes());
app.use(router.allowedMethods());
const port = env.PORT || 5000;
app.listen(port);
console.log(`echarts service is running on http://localhost:${port}`);
