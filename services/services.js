import { executeCachedQuery } from "../database/database.js";

const reportMorning = async(info) => {
    await executeCachedQuery("INSERT INTO morning (day, sleep_duration, sleep_quality, user_id) VALUES ($1, $2, $3, $4)",
                        info.day, info.sleep_duration, info.sleep_quality, info.id);
}

const reportEvening = async(info) => {
    await executeCachedQuery("INSERT INTO evening (day, exercise, study_time, regularity_of_eating, quality_of_eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);",
                        info.day, info.exercise, info.study, info.quality_of_eating, info.quality_of_eating, info.mood, info.id);
}

const isReported = async(day, user) => {
    let data = {};
    const morning = await executeCachedQuery("SELECT id FROM morning WHERE day=$1 AND user_id=$2", day, user);
    const evening = await executeCachedQuery("SELECT id FROM evening WHERE day=$1 AND user_id=$2", day, user);
    if (morning.rowCount > 0) {
        data.morning = morning.rowsOfObjects()[0].get('id');
    }
    if (evening.rowCount > 0) {
        data.evening = evening.rowsOfObjects()[0].get('id');
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

export {reportMorning, reportEvening, isReported, emailExists, addUser};