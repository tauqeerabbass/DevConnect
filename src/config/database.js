const mongoose = require("mongoose");

const URI = "mongodb+srv://alig72322_db_user:RKo4V0UEtdnGOoUt@nodecourse.zpji25m.mongodb.net/devTinder"

const connectDB = async () => {
    await mongoose.connect(URI);
}

module.exports = connectDB;