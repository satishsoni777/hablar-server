import mongoose from "mongoose";
import { Config, Flavor } from '../config/default.js'
class MongoDb {

  constructor() {
  }

  static mongoConnection;

  static instance = new MongoDb();
  async connectMd() {
    const url = Flavor.getMongoBaseUrl();
    console.log("Mongo db connecting..",url)
    mongoose.set('strictQuery', false);
    mongoose.connect(url).then((result) => {
      console.log("Mongo db connected", url)
      return result;
    }).catch((e) => {
      console.log(e);
      throw e;
    });
  }
}

export { MongoDb };

