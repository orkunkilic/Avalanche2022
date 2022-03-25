const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://hackathon:hackathon@cluster0.uwsu3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

module.exports = connectDB