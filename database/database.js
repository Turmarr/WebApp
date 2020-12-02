import { Client } from "../deps.js";
import { config } from "../config/config.js";

const getClient = () => {
  return new Client(config.database);
}

const executeQuery = async(query, ...args) => {
  const client = getClient();
  try {
    await client.connect();
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }
}

export { executeQuery };

/**
 * Database schema
 * 
 * user
 * id SERIAL PRIMARY KEY
 * email VARCHAR(320) NOT NULL
 * password CHAR(60) NOT NULL
 * 
 * CREATE UNIQUE INDEX ON users((lower(email)));
 * 
 * morning
 * id SERIAL PRIMARY KEY
 * day DATE NOT NULL
 * sleep_duration FLOAT(3,1) NOT NULL
 * sleep_quality INT NOT NULL
 * user_id REFERENCES user(id)
 * 
 * evening
 * id SERIAL PRIMARY KEY
 * day DATE NOT NULL
 * exercise FLOAT(3,1) NOT NULL
 * study_time FLOAT(3,1) NOT NULL
 * regularity_of_eating INT NOT NULL
 * quality_of_eating INT NOT NULL
 * mood INT NOT NULL
 * user_id REFERENCES user(id)
 * 
 */