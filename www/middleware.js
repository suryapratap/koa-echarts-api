"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.errorHandler = void 0;
const canvas_1 = require("canvas");
const echarts = require("echarts");
const config = process.env;
async function errorHandler(ctx, next) {
    try {
        await next();
    }
    catch (err) {
        // some errors will have .status
        // however this is not a guarantee
        ctx.status = err.status || 500;
        ctx.type = 'json';
        ctx.body = {
            status: 'failed',
            message: err.message || 'Something Failed!'
        };
        // since we handled this manually we'll
        // want to delegate to the regular app
        // level error handling as well so that
        // centralized still functions correctly.
        ctx.app.emit('error', err, ctx);
    }
}
exports.errorHandler = errorHandler;
const convertor = {
    svg: (canvas) => canvas.toBuffer(),
    image: (canvas) => canvas.toDataURL(),
    pdf: (canvas) => canvas.toBuffer(),
};
async function getImage(context) {
    const config = Object.assign({}, context.request.body);
    // config.option.animation = false;
    const type = context.params.type || 'svg';
    const width = parseInt(context.params.width || '500', 10);
    const height = parseInt(context.params.height || '500', 10);
    echarts.setCanvasCreator(function () {
        return new canvas_1.Canvas(125, 125);
    });
    const canvasElement = new canvas_1.Canvas(width, height, type);
    const canvas = (canvasElement);
    const chart = echarts.init(canvas);
    chart.setOption(config);
    context.body = convertor[type](chart.getDom());
    chart.dispose();
}
exports.getImage = getImage;
