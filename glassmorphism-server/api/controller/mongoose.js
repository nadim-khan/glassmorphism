const mongoose = require('mongoose');
require('dotenv').config();
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb+srv://${process.env.dbUser}:${process.env.dbPass}@gm-cluster-0.blvz8mv.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
  console.log(`${process.env.dbUser}:${process.env.dbPass}`)
  console.log('Successfully Connected to Mongo DB')
}).catch((e) => {
  console.log('Error on Mongo DB Connection \n', e)
})

// To prevent deprectation warnings (from MongoDB native driver)


module.exports = {
  mongoose
};

