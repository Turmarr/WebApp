import {send} from "../deps.js";

const errorMiddleware = async(context, next) => {
    try {
      await next();
    } catch (e) {
      console.log(e);
    }
}

const requestTimingMiddleware = async({ request }, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${request.method} ${request.url.pathname} - ${ms} ms`);
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
    if (session && await session.get('auth')) {
      await next();
    } else {
      response.status = 401;
      response.redirect('/');
    }
  } else {
    await next();
  }
};

export { errorMiddleware, requestTimingMiddleware, checkAuthMiddleware, serveStaticFilesMiddleware};