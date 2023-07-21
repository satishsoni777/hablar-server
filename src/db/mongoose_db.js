import mongoose from "mongoose";
import { Config, Flavor } from '../../config/default.js'
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import session from 'express-session';
const MongoDBStore = connectMongoDBSession(session);
class MongoDb {

  constructor() {
  }

  static mongoConnection;

  static instance = new MongoDb();
  connectMd() {
    const url = Flavor.getMongoBaseUrl();
    mongoose.set('strictQuery', false);
    mongoose.connect(url).then((result) => {
      console.log("Mongo db connected")
      return true;
    }).catch((e) => {
      throw e;
    });
  }
  // async getStore() {
  //   const store = new MongoDBStore({
  //     uri: Flavor.getMongoBaseUrl(), // Replace with your MongoDB connection URI
  //     collection: 'sessions' // Collection name for storing sessions
  //   });
  //   return store;
  // }
}

export { MongoDb };

