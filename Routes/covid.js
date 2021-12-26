const express = require("express");
const Joi = require("joi");
const cors = require("cors")
const multer = require("multer")
const crypto = require('crypto')

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
    for (i = 0; i < result.symptomsVal.length; i++) {
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
      }
    }
    if (title !== '' && message !== ''){
        res.send({
          status: "success",
          diagnosis: { title: title, message: message },
        });
    } else if (title == '' && message == ''){
        res.send({
          status: "success",
          diagnosis: { title: 'No symptoms present', message: 'Great! Keep being healthy but we would advise you to get tested for covid.' },
        });
    }
    
    
  });
  // get req
  // check present symptoms in the req and insert to array to be used
  // loop to array to to weight out diagnosis
  // evaluate diagnosis
  // res.send({status, action})
});

router.get('/',cors(), async(req,res)=>{
  const items = [
    {
      id: 1,
      title: 'Hydration',
      text: 'Always drink water and keep your body hydrated to help to: regulate body temperature, keep joints lubricated, prevent infections, deliver nutrients to cells, and keep organs functioning properly. Being well-hydrated also improves sleep quality, cognition, and mood.',
      link: 'https://www.hsph.harvard.edu/news/hsph-in-the-news/the-importance-of-hydration/#:~:text=Drinking%20enough%20water%20each%20day,quality%2C%20cognition%2C%20and%20mood.'
    },
    {
      id: 2,
      title: 'Loss of taste or smell or appetite',
      text: 'Losing your sense of taste or smell would ultimately diminish your appetite which might cause malnutrition and other complications. This would recover naturally but try to eat normally despite the temporary loss of hapiness from eating food.'
    },
    {
      id: 3,
      title: 'Steam inhalation',
      text: 'Try out inhaling steam from boiling hot water. This would help you in breathing easily, opening up congestions and provide temporary relief from colds, headaches and fever.'
    }
  ]

  res.send({text: 'hi', items: items})
})

module.exports = router;
