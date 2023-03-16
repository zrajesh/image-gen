import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.set("strictQuery", true);

    mongoose.connect(url)
        .then(() => console.log("DB CONNECTED"))
        .catch((err) => console.log("CONNECTION ERR: ", err))
};

export default connectDB;
