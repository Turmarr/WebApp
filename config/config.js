let config = {};

const test = true;

if (test) {
    config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "mryzwblt",
    user: "mryzwblt",
    password: "odzvfiZHb0T59mckjg89Q4ZHp5AHLS0J",
    port: 5432};
} else {
    const DATABASE_URL = Deno.env.toObject().DATABASE_URL;
    config.database = DATABASE_URL;
}

let port = 7777;
if (test) {
    config.port = port;
} else {
    if (Deno.args.length > 0) {  
        const lastArgument = Deno.args[Deno.args.length - 1];  
        port = Number(lastArgument);
    }
    config.port = port;
}

export { config }; 