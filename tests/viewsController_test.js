import {superoak} from "../deps.js";
import {app} from "../app.js";

Deno.test({
  name: "GET / returns 200 and has Welcome to activity tracker", 
  async fn() {
      const testClient = await superoak(app);
      await testClient.get("/").expect(200).expect(/Welcome to activity tracker/);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "/behaviour/summary when logged in should return the site", 
  async fn() {
      let testClient = await superoak(app);
      let res = await testClient.post("/auth/login")
      .send("email=test@test.org&password=test");
      let headers = res.headers["set-cookie"];
      let cookie = headers.split(";")[0];
      //console.log(cookie);
    
      testClient = await superoak(app);
      await testClient
        .get('/behaviour/summary')
        .set("Cookie", cookie).expect(/<h2>Summary/);

  },
  sanitizeResources: false,
  sanitizeOps: false
});
