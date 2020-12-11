import {superoak} from "../deps.js";
import {app} from "../app.js";

Deno.test({
    name: "request to /behaviour/reporting should return with title page when not logged in", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/behaviour/reporting").expect(/Reporting is/);
    },
    sanitizeResources: false,
    sanitizeOps: false
});
