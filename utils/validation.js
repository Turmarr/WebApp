import {validate, required, isDate, isEmail} from "../deps.js";


const dateRule = {
    date: [required, isDate]
};

const authRule = {
    email: [required, isEmail],
    password: [required, minLength(4)],
    password_r: [required, minLength(4)]
}

const dateIsValid = async(date) => {
    const data = {
        date: date
    }
    const [passes, errors] = await validate(data, dateRule);
    if (passes) {
        return true;
    }
    return false;
    
}

const regIsValid = async(data) => {
    const [passes, errors] = await validate(data, authRule);
    if (passes & data.password === data.password_r) {
        return true;
    }
    return false;
}

export {dateIsValid, regIsValid};