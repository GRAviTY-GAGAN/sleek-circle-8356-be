const express = require("express");
const { connection } = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.port;

app.use(express.json());

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`DB Connected.\nServer running at port ${PORT}🚀`);
  } catch (error) {
    console.log(error);
  }
});
