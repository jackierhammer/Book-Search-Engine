const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/27017/bookSearchDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  // changed false to true
  useFindAndModify: true,
});

module.exports = mongoose.connection;
