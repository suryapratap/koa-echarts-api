import "reflect-metadata";
import { resolve } from "path";
import { config } from "dotenv";
import * as Koa from "koa";
import * as cors from "@koa/cors";
import * as Router from "koa-router";
import * as body from "koa-body";
import * as logger from "koa-logger";
import { errorHandler, getImage } from "./middleware";

config({ path: resolve(process.cwd(), ".env") });
// console.log(`getting config from ${process.cwd()}\\.env`);
const app = new Koa();
const router = new Router();
const env = process.env;

app.use(errorHandler);
app.use(body({ multipart: true }));
app.use(logger());
app.use(cors())
router.post('/chart/:type/:height/:width', getImage);
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