import { Pool } from "../deps.js";
import { conf } from "../config/config.js";

const connectionPool = new Pool(conf.database, 4);

let cache = {};

const executeQuery = async(query, ...params) => {
  const client = await connectionPool.connect();
  try {
      return await client.query(query, ...params);
  } catch (e) {
      console.log(e);  
  } finally {
      client.release();
  }
  return null;
};

const executeCachedQuery = async(query, ...params) => {
  const key = query + params.reduce((acc, o) => acc + "-" + o, "");
  if (query.startsWith("INSERT")) {
      cache = {};
  }
  if (cache[key]) {
      return cache[key];
  }

  const res = await executeQuery(query, ...params);
  cache[key] = res;

  return res;
}

export { executeCachedQuery, executeQuery };

/**
 * Database schema
 * 
 * user
 * id SERIAL PRIMARY KEY
 * email VARCHAR(320) NOT NULL
 * password CHAR(60) NOT NULL
 * 
 * morning
 * id SERIAL PRIMARY KEY
 * day DATE NOT NULL
 * sleep_duration FLOAT(3,1) NOT NULL
 * sleep_quality INT NOT NULL
 * mood INT NOT NULL
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
 * CREATE UNIQUE INDEX ON users((lower(email)));
 * CREATE UNIQUE INDEX ON morning((day));
 * CREATE UNIQUE INDEX ON evening((day));
 * 
 */