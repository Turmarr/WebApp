import {getWeekNumber} from "../../utils/week.js";
import {getMonthlyData, getWeeklyData} from "../../services/services.js";

const main = ({render}) => {
    render('index.ejs');
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