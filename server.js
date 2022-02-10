const express = require("express");
const multer = require("multer");
const cors = require("cors");
// package imports

// local imports

const app = express();
const upload = multer({ dest: "userUploads" });
app.use(cors());
app.use(express.json());
// inits

app.use("/covid19", require("./Routes/covid"));
app.use('/user', require('./Routes/user'))
// Routers

const port = process.env.PORT || 8000;
//local vars

app.listen(port, (res, err) => {
  if (err) console.error(err);
  console.log(`Listening to port ${port}`);
});

app.get("/testendpoint", (req, res) => {
  res.send(`Server is up and running at port ${port}`);
});
