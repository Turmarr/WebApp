import {config} from "../deps.js";

let conf = {};


if (Deno.env.get('DATABASE_URL')) {
    conf.database = Deno.env.toObject().DATABASE_URL;
} else {
    
    conf.database = {
        hostname: config().PGHOST,
        database: config().PGDATABASE,
        user: config().PGUSER,
        password: config().PGPASSWORD,
        port: parseInt(config().PGPORT)
    };
}


export { conf }; 