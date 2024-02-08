import express from "express";
import cors from "cors";
import "dotenv/config.js";
import mongoDB from "./db.js";
import router from "./router/user_router.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "test",
  });
});

app.use("/api/0.1/user", router);

app.listen(process.env.PORT, () => {
  console.log(`server is listenning on port ${process.env.PORT}`);
  mongoDB();
});
