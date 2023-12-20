import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((data) => {
      console.log(`mongodb connected with server : ${data.connection.host}`);
    })
    .catch((error) => {
      console.log(error);
    });
};
export default connectDB;
