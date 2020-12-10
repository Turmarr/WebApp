import { Application, Session, oakCors } from "./deps.js";
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from './middlewares/middlewares.js';
import { config } from "./config/config.js";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views",
    useCache: true
}));

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));
app.use(oakCors());
app.use(middleware.errorMiddleware);
app.use(middleware.requestLoggingMiddleware);
app.use(middleware.checkAuthMiddleware);
app.use(middleware.serveStaticFilesMiddleware);

app.use(router.routes());

app.listen({port: config.port});