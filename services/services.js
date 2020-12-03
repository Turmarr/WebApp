import { executeQuery } from "../database/database.js";

const reportMorning = async(info) => {
    await executeQuery("INSERT INTO morning_data () values ()")
}