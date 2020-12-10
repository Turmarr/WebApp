import {reportMorning, reportEvening, isReported} from "../../services/services.js"
import { getLoginStatus } from "../../utils/get_login_status.js";

const reporting = async({render, session}) => {
    const today = new Date();
    const data = {
        auth: await getLoginStatus(session),
        reported: null,
        login: false,
        register: false
    };
    data.reported = await isReported(today, data.auth.user.id);
    //console.log(reported);
    render('reporting.ejs', data);
}

const morning_get = async({render, session}) => {
    const data = {
        auth: await getLoginStatus(session),
        login: false,
        register: false
    };
    render('reporting_mor.ejs', data);
}

const evening_get = async({render, session}) => {
    const data = {
        auth: await getLoginStatus(session),
        login: false,
        register: false
    };    
    render('reporting_eve.ejs', data);
}

const morning_post = async({request, session, response}) => {    

    const body = request.body();
    const params = await body.value;

    let data = {};

    data.id = (await getLoginStatus(session)).user.id;
    data.sleep_quality = params.get('sleep_quality');
    data.sleep_duration = params.get('sleep_duration');
    data.day = params.get('day');
    data.mood = params.get('mood');

    reportMorning(data);

    response.redirect('/');
}

const evening_post = async({request, session, response}) => {
    
    const body = request.body();
    const params = await body.value;

    let data = {};

    data.id = (await getLoginStatus(session)).user.id;
    data.exercise = params.get('exercise');
    data.study = params.get('study');
    data.regularity_of_eating = params.get('regularity_of_eating');
    data.quality_of_eating = params.get('quality_of_eating');
    data.mood = params.get('mood');
    data.day = params.get('day');

    reportEvening(data);

    response.redirect('/');
}

export {morning_get, morning_post, evening_get, evening_post, reporting};