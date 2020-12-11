import {superoak} from "../deps.js";
import {app} from "../app.js";


Deno.test({
    name: "request to /auth/registration should contain Register and return 200", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/auth/registration").expect(/<h2>Register/).expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "request to /auth/login should contain Login and return 200", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/auth/login").expect(/<h2>Login/).expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Email allready in use in post to /auth/registration should have error message", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.post("/auth/registration")
        .send("email=test@test.org&password=test&password_r=test");
        let headers = res.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        //console.log(cookie);
      
        testClient = await superoak(app);
        await testClient
          .get('/auth/registration')
          .set("Cookie", cookie).expect(/The email is allready in use./);

    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Invalid email to /auth/registration should have error message", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.post("/auth/registration")
        .send("email=test@test&password=test&password_r=test");
        let headers = res.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        //console.log(cookie);
      
        testClient = await superoak(app);
        await testClient
          .get('/auth/registration')
          .set("Cookie", cookie).expect(/The email was invalid./);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Invalid email to /auth/registration should have the email prefilled", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.post("/auth/registration")
        .send("email=test@test.org&password=test&password_r=test");
        let headers = res.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        //console.log(cookie);
      
        testClient = await superoak(app);
        await testClient
          .get('/auth/registration')
          .set("Cookie", cookie).expect(/test@test.org/);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "After login should have summary button on front page and should have 'You are logged in as email'", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.post("/auth/login").send("email=test@test.org&password=test");
        let headers = res.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        //console.log(cookie);
      
        testClient = await superoak(app);
        await testClient
            .get('/')
            .set("Cookie", cookie).expect(/Summary/)
            .expect(200);
        
        testClient = await superoak(app);
        await testClient
            .get('/')
            .set("Cookie", cookie).expect(/You are logged in as test@test.org/)
            .expect(200);
      
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Post to auth login should have summary button on front page", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.post("/auth/login").send("email=test@test.org&password=test");
        let headers = res.headers["set-cookie"];
        let cookie = headers.split(";")[0];
        //console.log(cookie);
      
        testClient = await superoak(app);
        await testClient
          .get('/')
          .set("Cookie", cookie).expect(/Summary/)
          .expect(200);
      
    },
    sanitizeResources: false,
    sanitizeOps: false
});
