import { Canvas } from "canvas";
import * as echarts from "echarts";
import { Context } from "koa";
const config = process.env;


export async function errorHandler(ctx: Context, next: any) {
    try {

        await next();
    } catch (err) {
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
        // centralized handler still functions correctly.
        ctx.app.emit('error', err, ctx);
    }
}

const convertor = {
    svg: (canvas: Canvas) => canvas.toBuffer(),
    image: (canvas: Canvas) => canvas.toDataURL(),
    pdf: (canvas: Canvas) => canvas.toBuffer(),
};

export async function getImage(context: Context) {
    const config = Object.assign({}, context.request.body);
    // config.option.animation = false;

    const type: keyof typeof convertor = context.params.type || 'svg';
    const width = parseInt(context.params.width || '500', 10);
    const height = parseInt(context.params.height || '500', 10);
    let dummyCanvas = new Canvas(125, 125);
    let canvasElement = new Canvas(width, height, type);
    (echarts as any).setCanvasCreator(() => canvasElement);
    let canvas = <HTMLCanvasElement><unknown>(canvasElement);
    let chart = echarts.init(canvas);
    chart.setOption(config);
    let buffer = convertor[type]((<Canvas><unknown>chart.getDom()));
    context.body = buffer;
    chart.dispose();


    chart = null;
    canvasElement = null;
    dummyCanvas = null;
    buffer = null;
    context = null;

}