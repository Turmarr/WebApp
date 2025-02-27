import { executeCachedQuery, executeQuery } from "../database/database.js";

const reportMorning = async(info) => {
    await executeCachedQuery("INSERT INTO morning (day, sleep_duration, sleep_quality, mood, user_id)" +
                                "VALUES ($1, $2, $3, $4, $5)"+
                                "ON CONFLICT (day, user_id)"+
                                "DO UPDATE SET sleep_duration=EXCLUDED.sleep_duration, sleep_quality=EXCLUDED.sleep_quality, mood=EXCLUDED.mood",
                        info.day, info.sleep_duration, info.sleep_quality, info.mood, info.id);
    
}

const reportEvening = async(info) => {
    await executeCachedQuery("INSERT INTO evening (day, exercise, study_time, regularity_of_eating, quality_of_eating, mood, user_id) "+
                            "VALUES ($1, $2, $3, $4, $5, $6, $7)"+
                            "ON CONFLICT (day, user_id)"+
                            "DO UPDATE SET exercise=EXCLUDED.exercise, study_time=EXCLUDED.study_time, regularity_of_eating=EXCLUDED.regularity_of_eating, quality_of_eating=EXCLUDED.quality_of_eating, mood=EXCLUDED.mood;",
                    info.day, info.exercise, info.study, info.quality_of_eating, info.quality_of_eating, info.mood, info.id);
}

const isReported = async(day, user) => {
    let data = {};
    const morning = await executeCachedQuery("SELECT id FROM morning WHERE day=$1 AND user_id=$2", day, user);
    const evening = await executeCachedQuery("SELECT id FROM evening WHERE day=$1 AND user_id=$2", day, user);
    data.morning = null;
    data.evening = null;
    
    if (morning.rowCount > 0) {
        data.morning = morning.rowsOfObjects()[0].id;
    }
    if (evening.rowCount > 0) {
        data.evening = evening.rowsOfObjects()[0].id;
    }
    return data;
}

const emailExists = async(email) => {
    const exists = await executeCachedQuery("SELECT * FROM users WHERE email=$1;", email);
    if (exists.rowCount > 0) {
        return false;
    }
    return true;
}

const addUser = async(email, pw) => {
    executeCachedQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, pw);
}

const getWeeklyData = async(week, year, id) => {
    let data = {};
    const mor = await executeCachedQuery("SELECT CAST(CAST((mm + em) AS FLOAT) / (cmm + cem) AS DECIMAL(3,1)) AS mood from "+
    "(SELECT SUM(mood) AS mm, Count(mood) AS cmm from morning WHERE user_id=$1 AND EXTRACT(WEEK FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3) AS m,"+
    "(SELECT SUM(mood) AS em, Count(mood) AS cem from evening WHERE user_id=$1 AND EXTRACT(WEEK FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3) AS e;", id, week, year);
    data.mood = mor.rowsOfObjects()[0].mood;
    data.sleep_duration = (await executeCachedQuery("SELECT CAST(AVG(sleep_duration) AS DECIMAL(3,1)) AS sleep FROM morning "+
    "WHERE user_id=$1 AND EXTRACT(WEEK FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, week, year)).rowsOfObjects()[0].sleep;
    data.sleep_quality = (await executeCachedQuery("SELECT CAST(AVG(sleep_quality) AS DECIMAL(3,1)) AS sleep FROM morning "+
    "WHERE user_id=$1 AND EXTRACT(WEEK FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, week, year)).rowsOfObjects()[0].sleep;
    data.exercise = (await executeCachedQuery("SELECT CAST(AVG(exercise) AS DECIMAL(3,1)) AS ex FROM evening "+
    "WHERE user_id=$1 AND EXTRACT(WEEK FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, week, year)).rowsOfObjects()[0].ex;
    data.study = (await executeCachedQuery("SELECT CAST(AVG(study_time) AS DECIMAL(3,1)) AS study FROM evening "+
    "WHERE user_id=$1 AND EXTRACT(WEEK FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, week, year)).rowsOfObjects()[0].study;
    data.roe = (await executeCachedQuery("SELECT CAST(AVG(regularity_of_eating) AS DECIMAL(3,1)) AS roe FROM evening "+
    "WHERE user_id=$1 AND EXTRACT(WEEK FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, week, year)).rowsOfObjects()[0].roe;
    data.qoe = (await executeCachedQuery("SELECT CAST(AVG(quality_of_eating) AS DECIMAL(3,1)) AS qoe FROM evening "+
    "WHERE user_id=$1 AND EXTRACT(WEEK FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, week, year)).rowsOfObjects()[0].qoe;
    return data;
}

const getMonthlyData = async(month, year, id) => {
    let data = {};
    const mor = await executeCachedQuery("SELECT CAST(CAST((mm + em) AS FLOAT) / (cmm + cem) AS DECIMAL(3,1)) AS mood from "+
    "(SELECT SUM(mood) AS mm, Count(mood) AS cmm from morning WHERE user_id=$1 AND EXTRACT(MONTH FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3) AS m,"+
    "(SELECT SUM(mood) AS em, Count(mood) AS cem from evening WHERE user_id=$1 AND EXTRACT(MONTH FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3) AS e;", id, month, year);
    data.mood = mor.rowsOfObjects()[0].mood;
    data.sleep_duration = (await executeCachedQuery("SELECT CAST(AVG(sleep_duration) AS DECIMAL(3,1)) AS sleep FROM morning "+
    "WHERE user_id=$1 AND EXTRACT(MONTH FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, month, year)).rowsOfObjects()[0].sleep;
    data.sleep_quality = (await executeCachedQuery("SELECT CAST(AVG(sleep_quality) AS DECIMAL(3,1)) AS sleep FROM morning "+
    "WHERE user_id=$1 AND EXTRACT(MONTH FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, month, year)).rowsOfObjects()[0].sleep;
    data.exercise = (await executeCachedQuery("SELECT CAST(AVG(exercise) AS DECIMAL(3,1)) AS ex FROM evening "+
    "WHERE user_id=$1 AND EXTRACT(MONTH FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, month, year)).rowsOfObjects()[0].ex;
    data.study = (await executeCachedQuery("SELECT CAST(AVG(study_time) AS DECIMAL(3,1)) AS study FROM evening "+
    "WHERE user_id=$1 AND EXTRACT(MONTH FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, month, year)).rowsOfObjects()[0].study;
    data.roe = (await executeCachedQuery("SELECT CAST(AVG(regularity_of_eating) AS DECIMAL(3,1)) AS roe FROM evening "+
    "WHERE user_id=$1 AND EXTRACT(MONTH FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, month, year)).rowsOfObjects()[0].roe;
    data.qoe = (await executeCachedQuery("SELECT CAST(AVG(quality_of_eating) AS DECIMAL(3,1)) AS qoe FROM evening "+
    "WHERE user_id=$1 AND EXTRACT(MONTH FROM day)=$2 AND EXTRACT(YEAR FROM day)=$3;", id, month, year)).rowsOfObjects()[0].qoe;
    //console.log(data);
    return data;
}

const getMoodForDay = async(id, day) => {
    const mood = [(await executeCachedQuery("SELECT mood from morning WHERE user_id=$1 AND day=$2;", id, day)).rowsOfObjects()[0],
                (await executeCachedQuery("SELECT mood from evening WHERE user_id=$1 AND day=$2;", id, day)).rowsOfObjects()[0]];
    let count = 0;
    let sum = 0;
    mood.forEach(mood => {
        if (typeof mood !== "undefined") {
            count += 1;
            sum += parseInt(mood.mood);
        }
    });
    if (count === 0) {
        return null;
    } else {
        return sum / count;
    }
}

const getLogin = async(email) => {
    return await executeQuery("SELECT * FROM users WHERE email=$1", email); 
}

const getDataForDay = async(date) => {
    let data = {};
    const mor = await executeCachedQuery("SELECT CAST(CAST((mm + em) AS FLOAT) / (cmm + cem) AS DECIMAL(3,1)) AS mood from "+
    "(SELECT SUM(mood) AS mm, Count(mood) AS cmm from morning WHERE day=$1) AS m,"+
    "(SELECT SUM(mood) AS em, Count(mood) AS cem from evening WHERE day=$1) AS e;", date);
    data.mood = mor.rowsOfObjects()[0].mood;
    data.sleep_duration = (await executeCachedQuery("SELECT CAST(AVG(sleep_duration) AS DECIMAL(3,1)) AS sleep FROM morning "+
    "WHERE day=$1;", date)).rowsOfObjects()[0].sleep;
    data.sleep_quality = (await executeCachedQuery("SELECT CAST(AVG(sleep_quality) AS DECIMAL(3,1)) AS sleep FROM morning "+
    "WHERE day=$1;", date)).rowsOfObjects()[0].sleep;
    data.exercise = (await executeCachedQuery("SELECT CAST(AVG(exercise) AS DECIMAL(3,1)) AS ex FROM evening "+
    "WHERE day=$1;", date)).rowsOfObjects()[0].ex;
    data.study = (await executeCachedQuery("SELECT CAST(AVG(study_time) AS DECIMAL(3,1)) AS study FROM evening "+
    "WHERE day=$1;", date)).rowsOfObjects()[0].study;
    data.regularity_of_eating = (await executeCachedQuery("SELECT CAST(AVG(regularity_of_eating) AS DECIMAL(3,1)) AS roe FROM evening "+
    "WHERE day=$1;", date)).rowsOfObjects()[0].roe;
    data.quality_of_eating = (await executeCachedQuery("SELECT CAST(AVG(quality_of_eating) AS DECIMAL(3,1)) AS qoe FROM evening "+
    "WHERE day=$1;", date)).rowsOfObjects()[0].qoe;
    //console.log(data);
    return data;
}

const getDataForInterval = async(start, stop) => {
    let data = {};
    const mor = await executeCachedQuery("SELECT CAST(CAST((mm + em) AS FLOAT) / (cmm + cem) AS DECIMAL(3,1)) AS mood from "+
    "(SELECT SUM(mood) AS mm, Count(mood) AS cmm from morning WHERE day>=$1 AND day<=$2) AS m,"+
    "(SELECT SUM(mood) AS em, Count(mood) AS cem from evening WHERE day>=$1 AND day<=$2) AS e;", start, stop);
    data.mood = mor.rowsOfObjects()[0].mood;
    data.sleep_duration = (await executeCachedQuery("SELECT CAST(AVG(sleep_duration) AS DECIMAL(3,1)) AS sleep FROM morning "+
    "WHERE day>=$1 AND day<=$2;", start, stop)).rowsOfObjects()[0].sleep;
    data.sleep_quality = (await executeCachedQuery("SELECT CAST(AVG(sleep_quality) AS DECIMAL(3,1)) AS sleep FROM morning "+
    "WHERE day>=$1 AND day<=$2;", start, stop)).rowsOfObjects()[0].sleep;
    data.exercise = (await executeCachedQuery("SELECT CAST(AVG(exercise) AS DECIMAL(3,1)) AS ex FROM evening "+
    "WHERE day>=$1 AND day<=$2;", start, stop)).rowsOfObjects()[0].ex;
    data.study = (await executeCachedQuery("SELECT CAST(AVG(study_time) AS DECIMAL(3,1)) AS study FROM evening "+
    "WHERE day>=$1 AND day<=$2;", start, stop)).rowsOfObjects()[0].study;
    data.regularity_of_eating = (await executeCachedQuery("SELECT CAST(AVG(regularity_of_eating) AS DECIMAL(3,1)) AS roe FROM evening "+
    "WHERE day>=$1 AND day<=$2;", start, stop)).rowsOfObjects()[0].roe;
    data.quality_of_eating = (await executeCachedQuery("SELECT CAST(AVG(quality_of_eating) AS DECIMAL(3,1)) AS qoe FROM evening "+
    "WHERE day>=$1 AND day<=$2;", start, stop)).rowsOfObjects()[0].qoe;
    //console.log(data);
    return data;
}
 

export {reportMorning, getMoodForDay, reportEvening, isReported, emailExists, addUser, getWeeklyData, getMonthlyData, getLogin, getDataForDay, getDataForInterval};