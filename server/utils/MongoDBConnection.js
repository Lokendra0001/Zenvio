const mongoose = require('mongoose');

const mongoDBConnection = (uri) => {
    mongoose.connect(uri).then(() => console.log("MongoDB Connected Successfully!")).catch(err => console.log("Something Went Wrong!", err.message))
}

module.exports = mongoDBConnection