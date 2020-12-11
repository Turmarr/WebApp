import { assertEquals} from "../deps.js";
import {getLoginStatus} from "../utils/get_login_status.js";

const getAuthNone = (param) => {

}

const getAuthSome = (param) => {
    const data = {auth: true, user: {email: "foo@bar", id: 1}};
    return data[param];
}

const mockSessionNone = {
    get: getAuthNone
}

const mockSessionSome = {
    get: getAuthSome
}

Deno.test({
    name: "Test getLoginStatus with no login in mock session returns null", 
    async fn() {
        const log = await getLoginStatus(mockSessionNone);
        assertEquals(log, { auth: null, user: null })
        //console.log(log);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test getLoginStatus with login in mock session returns auth info", 
    async fn() {
        const log = await getLoginStatus(mockSessionSome);
        assertEquals(log, {auth: true, user: {email: "foo@bar", id: 1}})
        //console.log(log);
    },
    sanitizeResources: false,
    sanitizeOps: false
});