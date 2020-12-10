import {assertEquals} from "../deps.js";
import {regIsValid} from "./validation.js";

Deno.test("shold pass", async() => {
    const data = {
        email: "hi@email.com",
        password: "123456",
        password_r: "123456"
    }
    assertEquals(await regIsValid(data), true);
});

Deno.test("passwords don't match", async() => {
    const data = {
        email: "hi@email.com",
        password: "123456",
        password_r: "123457"
    }
    assertEquals(await regIsValid(data), false);
});

Deno.test("incorrect email", async() => {
    const data = {
        email: "hi@email",
        password: "123456",
        password_r: "123457"
    }
    assertEquals(await regIsValid(data), false);
});

Deno.test("too short password", async() => {
    const data = {
        email: "hi@email",
        password: "123",
        password_r: "123"
    }
    assertEquals(await regIsValid(data), false);
});