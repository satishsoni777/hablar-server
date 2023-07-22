import mongoose from "mongoose";
import { Flavor } from '../../config/default.js'
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

