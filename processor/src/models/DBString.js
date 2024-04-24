import 'dotenv/config';

import * as mongoose from 'mongoose';



let db;

export async function getDBConnectionString() {
  if (db) {
    return db;
  } 

  const productionConnectionString = process.env.MONGO_URL;

  const localConnectionString = 'mongodb://localhost:27017/SamsarGG';

  const DB_NAME = 'Imaginewares';
  if (process.env.CURRENT_ENV === 'production') {
    mongoose.connect(`${productionConnectionString}`, {useNewUrlParser: true, useUnifiedTopology: true});      
  } else {
      mongoose.connect(`${localConnectionString}`, {useNewUrlParser: true, useUnifiedTopology: true});
  }
  db = mongoose;
  
  return db;
}

