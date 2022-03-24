const mongoose = require("mongoose");
const app = require("./app");

const user = "mongoadmin";
const password = "mongopass";
const serverUrl = "chatdb.hgs41.mongodb.net";
const dataBaseName = "chatAngular";
const URL_MONGODB ="mongodb+srv://"+user+":"+password+"@"+ serverUrl + "/" + dataBaseName + "?retryWrites=true&w=majority";
const PORT= process.env.PORT || '8888';

mongoose.connect(URL_MONGODB,
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


