require('dotenv').config()
const mongoose = require("mongoose");
const app = require("./app");

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const PORT= process.env.PORT;

mongoose.connect(MONGO_DB_URI,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    },
    (err)=>{
    try {
        if(err){
            throw err;
        }else{
            console.log("MongoDB connection successful!");
            app.listen(PORT,()=>{ 
                console.log(`Best App is listening at http://localhost:${PORT}...`);
            });
        }
    } catch (error) {
        console.error(error);
    }
});


