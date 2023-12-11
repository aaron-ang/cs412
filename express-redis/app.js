import express from "express";

import ps4 from "./ps4.js";

const app = express();
const port = 3000;

app.use("/ps4", ps4);

app.set("view engine", "pug");

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
