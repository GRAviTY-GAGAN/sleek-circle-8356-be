const express = require("express");
const { connection } = require("./db");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { userRouter } = require("./Routes/user.routes");
const { recipeRoute } = require("./Routes/recipe.routes");

const app = express();
const PORT = process.env.port;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/users", userRouter);
app.use("/recipe", recipeRoute);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`DB Connected.\nServer running at port ${PORT}🚀`);
  } catch (error) {
    console.log(error);
  }
});
