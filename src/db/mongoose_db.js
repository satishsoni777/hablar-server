import mongoose from "mongoose";
import { Config } from '../config/default.js'
class MongoDb {

  constructor() {
  }

  static mongoConnection;

  static instance = new MongoDb();
  async connectMd() {
    const url = process.env.PORT != undefined ? Config.removeDbUrl : Config.localDbUrl
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

