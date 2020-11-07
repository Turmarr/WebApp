import { decode } from "https://deno.land/std@0.65.0/encoding/utf8.ts";
import { serve } from "https://deno.land/std@0.65.0/http/server.ts";
import { renderFile } from 'https://deno.land/x/dejs@0.8.0/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.4.5/mod.ts";

const DATABASE_URL = Deno.env.toObject().DATABASE_URL;
const client = new Client(DATABASE_URL)
;let port = 7777;
if (Deno.args.length > 0) {  
    const lastArgument = Deno.args[Deno.args.length - 1];  
    port = Number(lastArgument);
}
const server = serve({ port: port });

const server = serve({ port: 7777 });

const executeQuery = async(query, ...args) => {
    let res = [];
    try {
        await client.connect();
        res = await client.query(query, ...args);
    } catch (e) {
        console.log(e);
    } finally {
        await client.end();
        return res;
    }
}

const getMessages = async(request) => {
    const result = await executeQuery("SELECT * FROM messages ORDER BY id DESC LIMIT 5;");
    if (result) {
        return result.rowsOfObjects();
    }
    return [];
}

const postMessage = async(request) => {
    const body = decode(await Deno.readAll(request.body));
    const params = new URLSearchParams(body);

    const sender = params.get('sender');
    const message = params.get('message');
    //console.log('before');
    await executeQuery("INSERT INTO messages (sender, message) VALUES ($1, $2)", sender, message);
    //console.log('after');
}

const redirectToMessages = (request) => {
    request.respond({
        status: 303,
        headers: new Headers({
            'Location': '/',
        })
    });
};

const handleGetMessages = async(request) => {
    const data = {
        messages: await getMessages()
    };
    request.respond({body: await renderFile('index.ejs',data) });
}

const handlePostMessage = async(request) => {
    await postMessage(request);
    redirectToMessages(request);

}

for await (const request of server) {
    if (request.method === 'GET' && request.url === '/') {
        await handleGetMessages(request);
    } else if (request.method === 'POST' && request.url === '/') {
        await handlePostMessage(request);
    } else {
        redirectToMessages(request);
    }
}