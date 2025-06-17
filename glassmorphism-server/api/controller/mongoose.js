const mongoose = require('mongoose');
const config = require('../config/config');
mongoose.Promise = global.Promise;
const mongoUri = `mongodb+srv://${config.mongo.DB_USER}:${config.mongo.DB_KEY}@gm-cluster-0.blvz8mv.mongodb.net/`

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
  console.log('Successfully Connected to Mongo DB')
}).catch((e) => {
  console.log('Error on Mongo DB Connection \n', e)
});

module.exports = {
  mongoose
};

