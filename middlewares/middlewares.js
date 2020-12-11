import {send} from "../deps.js";
import {getLoginStatus} from "../utils/get_login_status.js";

const errorMiddleware = async(context, next) => {
    try {
      await next();
    } catch (e) {
      console.log(e);
    }
}

const requestLoggingMiddleware = async({ request, session }, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    const log = await getLoginStatus(session);
    let usr = "anonymous";
    if (log.auth) {
      usr = log.user.id; 
    }
    const current = Date();
    console.log(`${current} ${request.method} ${request.url.pathname} ${usr} - ${ms} ms`);
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

const checkAuthMiddleware = async({request, response, session}, next) => {
  if (request.url.pathname.startsWith('/behaviour')) {
    const auth = await getLoginStatus(session);
    if (auth.auth) {
      await next();
    } else {
      response.status = 401;
      response.redirect('/');
    }
  } else {
    await next();
  }
};

export { errorMiddleware, requestLoggingMiddleware, checkAuthMiddleware, serveStaticFilesMiddleware};