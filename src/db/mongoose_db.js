import mongoose from "mongoose";
import {Config} from '../config/default.js'

export default async function connectMd() {
  console.log("Connecting mogo db...");
  await mongoose.connect(Config.dbUrl).then(() => {
    console.log("Connected")
  }).catch((e) => { console.log("Not Connected", e) });

}
export async function inserOneData(data) {
  try {
    const result = await data.save();
    if(result){
      console.log(result);
    }
  }
  catch (e) {
    console.log(e);
    throw e;
  }
  // mongoose.collection("users_profile").insertOne(data, function (err, res) {
  //   if (err) throw err;
  //   mongoose.close();
  // });
}



