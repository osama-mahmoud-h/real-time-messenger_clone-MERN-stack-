import mongoose from "mongoose";
const connection = async (): Promise<Boolean> => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.URI_STRING || "", {
            //maxConnecting:30,
            maxPoolSize: 1000,
            socketTimeoutMS: 80 * 1000,//30 seconds
            connectTimeoutMS: 30 * 1000,
            //retryWrites:true,
            // retryReads:true
            maxIdleTimeMS: 1000 * 20, // 20 seconds

        });
        console.log("DATABASE CONNECTED.");
        return true;
    } catch (err: any) {
        console.error("db connection error:", err.message);
        await mongoose.connection.close();
        return false;
    }
};

export default connection;
