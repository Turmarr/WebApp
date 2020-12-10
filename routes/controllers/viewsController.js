import {getWeekNumber} from "../../utils/week.js";
import {getMonthlyData, getWeeklyData, getMoodForDay} from "../../services/services.js";
import { getLoginStatus } from "../../utils/get_login_status.js";

const main = async({render, session}) => {
    const auth = await getLoginStatus(session);
    //console.log(auth);
    const data = {
        auth: auth,
        mood_t: null,
        mood_y: null,
        login: true,
        register: true
    }
    if (data.auth.auth !== null) {
        data.mood_t = await getMoodForDay(auth.user.id, new Date());
        data.mood_y = await getMoodForDay(auth.user.id, new Date((new Date()).valueOf() - 1000*60*60*24));
    }
    
    //console.log(data);
    render('index.ejs', data);
}

const getSummary = async({render, session}) => {
    const auth = await getLoginStatus(session);
    const dates = await session.get('dates');
    const time = getWeekNumber(new Date())
    let data = {
        auth: auth,
        year: time[0],
        week_nr: time[1],
        month_nr: new Date().getMonth() + 1,
        login: false,
        register: false
    }

    if (dates) {
        data.year = dates.year
        data.week_nr = dates.week;
        data.month_nr = dates.month;
    }
    
    data.week = await getWeeklyData(data.week_nr, data.year, auth.user.id);
    data.month = await getMonthlyData(data.month_nr, data.year, auth.user.id);
    await session.set('dates', null);
    //console.log(data);
    render('summary.ejs', data);
}

const postSummary = async({request, session, response}) => {
    const dates = {
        month: null,
        week: []
    };
    const body = request.body();
    const params = await body.value;
    dates.month = parseInt(params.get('month').substring(5));
    dates.year = parseInt(params.get('month').substring(0,4));
    dates.week = parseInt(params.get('week').substring(6));
    await session.set('dates', dates);
    response.redirect('/behaviour/summary');
}

export {main, getSummary, postSummary};