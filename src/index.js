require('dotenv').config()
const mongoose = require("mongoose");
const app = require("./app");

const {MONGO_DB_URI,MONGO_DB_TEST_URI,NODE_ENV} = process.env;
const PORT= process.env.PORT;

const connectionString = NODE_ENV === 'test'
? MONGO_DB_TEST_URI
:MONGO_DB_URI

mongoose.connect(connectionString,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true,
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
