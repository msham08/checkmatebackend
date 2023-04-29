import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTION = {
      dbName: process.env.DBNAME,
      user: process.env.DBUSERNAME,
      pass: process.env.DBPASSWORD,
      authSource: process.env.DBAUTHSOURCE,


    };
    await mongoose.connect(DATABASE_URL, DB_OPTION);
    console.log("CONNECTED succefully");
  } catch (err) {
    console.log(err);
  }
};
export default connectDB;
