import {reportMorning, reportEvening, isReported} from "../../services/services.js"

const reporting = async({render, session}) => {
    const today = new Date();
    //const id = await session.get('id');
    const id = 1;
    const reported = await isReported(today, id);
    render('reporting.ejs', {reported: reported});
}

const morning_get = async({render}) => {
    render('reporting_mor.ejs');
}

const evening_get = async({render}) => {
    render('reporting_eve.ejs');
}

const morning_post = async({request, session, response}) => {
    
    const body = request.body();
    const params = await body.value;

    let data = {};

    //data.id = await session.get('id');
    data.id = 1;
    data.sleep_quality = params.get('sleep_quality');
    data.sleep_duration = params.get('sleep_duration');
    data.day = params.get('day');

    reportMorning(data);

    response.redirect('/');
}

const evening_post = async({request, session, response}) => {
    
    const body = request.body();
    const params = await body.value;

    let data = {};

    //data.id = await session.get('id');
    data.id = 1;
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