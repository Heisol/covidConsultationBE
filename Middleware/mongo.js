const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// export default client;
// notes6

module.exports = client