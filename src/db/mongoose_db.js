import mongoose from "mongoose";
import { Config } from '../config/default.js'
class MongoDb {

  constructor() {
  }
  static mongoConnection;

  static instance = new MongoDb();
  async connectMd() {
    mongoose.connect(Config.dbUrl).then((result) => {
      console.log("Mongo db connected")
      return result;
    }).catch((e) => {
      console.log(e);
      throw e;
    });
  }

}
export { MongoDb };

