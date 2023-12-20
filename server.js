import express from "express";
import dotenv from "dotenv";
import productRoute from "./routes/productRoutes.js";
import userRoute from "./routes/userRoute.js";
import db from "./db.js";
import cookieParser from "cookie-parser";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import bodyParser from "body-parser";
import path from "path";

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({ path: "backend/.env" });
db();
app.use(fileUpload());

cloudinary.config({
  cloud_name: "dvz68hfbd",
  api_key: "492518426451581",
  api_secret: "g7w5B9StfBHnOb7VCKZXZcWuKUY",
});

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

app.use(express.static(path.join(__dirname, "./frontend/build")));

// Define a route to serve the React app
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});
const PORT = process.env.PORT || 8200;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
