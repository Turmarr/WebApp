import {getWeekNumber} from "../../utils/week.js";
import {getMonthlyData, getWeeklyData, getMoodForDay} from "../../services/services.js";

const main = async({render, session}) => {
    const id = 1
    const data = {
        id: id,
        email: "hi",
        mood_t: await getMoodForDay(id, new Date()),
        mood_y: await getMoodForDay(id, new Date((new Date()).valueOf() - 1000*60*60*24))
    }
    
    console.log(data);
    render('index.ejs', {data: data});
}

const getSummary = async({render, session}) => {
    const dates = await session.get('dates');
    const time = getWeekNumber(new Date())
    let data = {
        year: time[0],
        week_nr: time[1],
        month_nr: new Date().getMonth() + 1,
    }

    if (dates) {
        data.year = dates.year
        data.week_nr = dates.week;
        data.month_nr = dates.month;
    }
    
    data.week = await getWeeklyData(data.week_nr, data.year, 1);
    data.month = await getMonthlyData(data.month_nr, data.year, 1);
    await session.set('dates', null);
    //console.log(data);
    render('summary.ejs', {data: data});
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