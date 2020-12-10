import {bcrypt} from "../../deps.js"
import {regIsValid} from "../../utils/validation.js";
import { emailExists, addUser, getLogin } from "../../services/services.js";
import { getLoginStatus } from "../../utils/get_login_status.js";

const register_post = async({request, session, response}) => {
    const body = request.body();
    const params = await body.value;
    const data = {
        email: params.get('email'),
        password: params.get('password'),
        password_r: params.get('password_r')
    }
    if (!(await regIsValid(data))) {
        await session.set('error',{message: "The email was invalid.", email: data.email});
        response.redirect('/auth/registration');
    } else if (!(await emailExists(data.email))) {
        await session.set('error',{ message:"The email is allready in use.", email: data.email});
        response.redirect('/auth/registration');
    } else {
        await session.set('error', null);
        const hash = await bcrypt.hash(data.password);
        addUser(data.email, hash);
        response.redirect('/');
    }
}

const login_get = async({render, session}) => {
    const data = {
        auth: await getLoginStatus(session),
        register: true,
        login: false,
        error: null
    }
    const e = await session.get('error');
    if (e) {
        data.error = e;
    }
    session.set('error', null);
    render('login.ejs', data);
}

const register_get = async({session, render}) => {
    const data = {
        auth: await getLoginStatus(session),
        error: null,
        login: true,
        register: false
    }; 
    const e = await session.get('error');
    if (e) {
        data.error = e;
    }
    session.set('error', null);
    render('register.ejs', data);
}

const login_post = async({request, session, response}) => {
    const body = request.body();
    const params = await body.value;
    const email = params.get('email');
    const password = params.get('password');
    
    const login = await getLogin(email);
    
    if (login.rowCount === 0) {
        response.status = 401;
        await session.set('error', "Invalid email or password");
        await response.redirect('/auth/login');
        return;
    }

    const userObj = login.rowsOfObjects()[0];

    const hash = userObj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        response.status = 401;
        await session.set('error', "Invalid email or password");
        await response.redirect('/auth/login');
        return;
    }

    await session.set('auth', true);
    await session.set('user', {
        email: userObj.email,
        id: userObj.id
    });
    
    
    response.redirect('/');
}

const logout = async({session, response}) => {
    await session.set('auth', null);
    await session.set('user', null);

    response.redirect('/');
}

export {register_get, register_post, login_get, login_post, logout};