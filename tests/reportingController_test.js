import {superoak} from "../deps.js";
import {app} from "../app.js";


Deno.test({
    name: "/behaviour/reporting when logged in should return the site", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.post("/auth/login")
        .send("email=test@test.org&password=test");
        let headers = res.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        //console.log(cookie);
      
        testClient = await superoak(app);
        await testClient
          .get('/behaviour/reporting')
          .set("Cookie", cookie).expect(/<h2>Reporting/);

    },
    sanitizeResources: false,
    sanitizeOps: false
});