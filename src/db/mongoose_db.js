import { MongoClient } from "mongodb";
var dboObject, dbm;
export default async function connectMd() {
  MongoClient.connect('mongodb://localhost:/teasyDb', { useNewUrlParser: true, }, function (err, db) {
    if (err) {
      console.log("Not Connected", err)
    }
    else {
      dboObject = db.db("teasyDb");
      dbm = db;
      console.log("Connected")
    }

  });
}
export async function inserOneData(data) {
   dboObject.collection("users_profile").insertOne(data, function (err, res) {
    if (err) throw err;
    dbm.close();
  });
}


