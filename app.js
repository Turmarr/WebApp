import { serve } from "https://deno.land/std@0.65.0/http/server.ts";

let port = 7777;

if (Deno.args.length > 0) {
    const lastArgument = Deno.args[Deno.args.length - 1];
    port = Number(lastArgument);
}
const server = serve({ port: port });

const requestParams = (url) => {
    let queryParams = '';
    if (url.includes('?')) {
        queryParams = url.slice(url.indexOf('?'));
    }

    return new URLSearchParams(queryParams);
}

for await (const request of server) {
    const params = requestParams(request.url);

    let res = '';
    if (params.has('operation') && params.has('number1') && params.has('number2')) {
        
        const op = params.get('operation');
        const n1 = Number(params.get('number1'));
        const n2 = Number(params.get('number2'));
        if (op === 'sum') {
            res = n1 + n2;
        } else if (op === 'difference') {
            res = n1 - n2;
        } else if (op === 'product') {
            res = n1 * n2;
        } else if (op === 'quotient') {
            res = n1 / n2;
        } else {
            res = 'Invalid parameters.';
        }

    } else {
        res = 'Invalid parameters.';
    }

    request.respond({ body: `${res}` });
}