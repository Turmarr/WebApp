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
    
    let month_nr = new Date().getMonth();
    let year_m = time[0];
    if (month_nr === 0) {
        year_m -= 1;
        month_nr = 12;
    }
    
    let week = time[1]-1;
    let year_w = time[0];
    if (week === 0) {
        year_w -= 1;
        week = getWeekNumber(new Date((new Date()).valueOf() - 1000*60*60*24*7))[1];
    }


    let data = {
        auth: auth,
        year_m: year_m,
        year_w: year_w,
        week_nr: week,
        month_nr: month_nr,
        login: false,
        register: false
    }

    if (dates) {
        data.year_m = dates.year_m;
        data.year_w = dates.year_w;
        data.week_nr = dates.week;
        data.month_nr = dates.month;
    }
    
    data.week = await getWeeklyData(data.week_nr, data.year_w, auth.user.id);
    data.month = await getMonthlyData(data.month_nr, data.year_m, auth.user.id);
    await session.set('dates', null);
    //console.log(data);
    if (data.week_nr < 10) {
        data.week_nr = "0"+ data.week_nr.toString();
    }
    console.log(data);
    render('summary.ejs', data);
}

const postSummary = async({request, session, response}) => {
    const dates = {
        month: null,
        week: null,
        year_m: null,
        year_w: null
    };
    const body = request.body();
    const params = await body.value;
    dates.month = parseInt(params.get('month').substring(5));
    dates.year_m = parseInt(params.get('month').substring(0,4));
    dates.year_w = parseInt(params.get('week').substring(0,4));
    dates.week = parseInt(params.get('week').substring(6));
    await session.set('dates', dates);
    console.log(dates);
    response.redirect('/behaviour/summary');
}

export {main, getSummary, postSummary};