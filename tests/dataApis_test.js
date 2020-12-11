import {superoak} from "../deps.js";
import {app} from "../app.js";

Deno.test({
    name: "api gives correct numbers for day", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.get("/api/summary/2020/12/7")
        .expect({"mood":"4.5","sleep_duration":"7.0","sleep_quality":"4.0",
        "exercise":"4.0","study":"4.0","regularity_of_eating":"4.0",
        "quality_of_eating":"4.0"});
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "api works while part of day has no data, mood=null", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.get("/api/summary/2020/12/8")
        .expect({"mood":null,"sleep_duration":"7.0","sleep_quality":"4.0",
        "exercise":null,"study":null,"regularity_of_eating":null,
        "quality_of_eating":null});
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "api works while no data", 
    async fn() {
        let testClient = await superoak(app);
        let res = await testClient.get("/api/summary/2020/12/1")
        .expect({"mood":null,"sleep_duration":null,"sleep_quality":null,
        "exercise":null,"study":null,"regularity_of_eating":null,
        "quality_of_eating":null});
    },
    sanitizeResources: false,
    sanitizeOps: false
});