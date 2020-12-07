import {bcrypt} from "../../deps.js"
import {regIsValid} from "../../utils/validation.js";
import { emailExists, addUser } from "../../services/services.js";

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

const login_get = async({render}) => {
    render('login.ejs');
}

const register_get = async({session, render}) => {
    let data = {error: null}; 
    const e = await session.get('error');
    if (e) {
        data.error = e;
    }
    render('register.ejs', data);
    session.set('error', null);
}

const login_post = async({request, response}) => {

}

const logout = async({request, response}) => {

}

export {register_get, register_post, login_get, login_post, logout};