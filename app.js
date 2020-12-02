import { Application, Session } from "./deps.js";
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';
import { config } from "./config/config.js";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

app.use(middleware.errorMiddleware);
app.use(middleware.requestTimingMiddleware);

app.use(router.routes());

app.listen({port: config.port});