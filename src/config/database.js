const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb://ayushsinghbca2022_db_user:UklhrGEq6x9vrqNM@ac-1bcceap-shard-00-00.dz8yryb.mongodb.net:27017,ac-1bcceap-shard-00-01.dz8yryb.mongodb.net:27017,ac-1bcceap-shard-00-02.dz8yryb.mongodb.net:27017/devTinder?ssl=true&replicaSet=atlas-4x6iv1-shard-0&authSource=admin&appName=NamasteDev",
  );
};

module.exports = connectDB;
