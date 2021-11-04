const express = require("express");
const Joi = require("joi");
const cors = require("cors")
const multer = require("multer")

const router = express.Router();
const upload = multer()

router.use(cors())

router.post("/", cors(), upload.none(),async (req, res) => {
  const newReqBody = {symptoms: JSON.parse(req.body.symptoms), symptomsVal: JSON.parse(req.body.symptomsVal)}
  const schema = Joi.object({
    symptoms: Joi.array().items(Joi.string().required()).required(),
    symptomsVal: Joi.array().items(Joi.bool().required()).required(),
  });
  schema.validateAsync(newReqBody).then((result, err) => {
    if (err) {
      res.send({ status: "error", log: `${err.message}` });
      res.end();
      return;
    }
    // common symptoms is 0-9 serious symptoms is 10-12
    var i = 0;
    var title = "";
    var message = "";
    var hasMild = false;
    var hasSerious = false;
    for (i = 0; i < result.symptoms; i++) {
      if (i < 10 && result.symptomsVal[i] == true) {
        if (title === "") {
          title = `Mild and common symptom(s) present : ${result.symptoms[i]}`;
        } else if (title !== "") {
          title = title + `, ${result.symptoms[i]}`;
        }
        message =
          "If you are healthy other than the mild symptoms, please stay at home. Otherwise seek medical Attention";
        hasMild = true;
      }
      if (i > 9 && result.symptomsVal[i] == true) {
        if (title === "" || hasMild === true) {
          hasMild = false;
          title = `Serious symptom(s) present : ${result.symptoms[i]}`;
        } else if (title !== "") {
          title = title + `, ${result.symptoms[i]}`;
        }
        message =
          "Immediately seek medical Attention. (Visit your nearest health center or doctor especially if you other underlying medical conditions)";
        return;
      }
    }
    res.send({
      status: "success",
      diagnosis: { title: title, message: message },
    });
  });
  // get req
  // check present symptoms in the req and insert to array to be used
  // loop to array to to weight out diagnosis
  // evaluate diagnosis
  // res.send({status, action})
});

module.exports = router;
