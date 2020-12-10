import {getDataForDay, getDataForInterval} from "../../services/services.js";

const getLast7Days = async({response}) => {
    const stop = new Date();
    const start = new Date((new Date()).valueOf() - 1000*60*60*24*7)
    const data = await getDataForInterval(start, stop);
    //console.log(data);
    response.body = data;
}

const getDay = async({ params, response }) => {
    //console.log(params.day)
    const date = new Date(Date.UTC(params.year, params.month-1, params.day));
    const data = await getDataForDay(date);
    response.body = data;
}

export {getLast7Days, getDay};