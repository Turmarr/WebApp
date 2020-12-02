let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
    config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "amzhmgzx",
    user: "amzhmgzx",
    password: "8IHzagV76hXtrloENJfBVIS2_QktaXsv",
    port: 5432};
} else {
    const DATABASE_URL = Deno.env.toObject().DATABASE_URL;
    config.database = DATABASE_URL;
}

let port = 7777;
if (Deno.env.get('TEST_ENVIRONMENT')) {
    config.port = port;
} else {
    if (Deno.args.length > 0) {  
        const lastArgument = Deno.args[Deno.args.length - 1];  
        port = Number(lastArgument);
    }
    config.port = port;
}

export { config }; 