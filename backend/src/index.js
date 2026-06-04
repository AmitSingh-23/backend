import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
import mongooseconnect from './db/index.js';
import app from './app.js';


mongooseconnect()
.then(()=>{
  app.listen(process.env.PORT||4000,()=>{
    console.log(`server is running on port ${process.env.PORT||4000}`);
  })


})
.catch((err) => {
  console.log("error in database connection", err);
})


/*;(async () => {
  try {
    const apple=await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    console.log("connected to database",apple.connection.name);
    app.on("error",(err)=>{
        console.error("error",err)
        throw err;
    })
  
  app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);       
  })
}

  catch (err) {
    console.error("error",err)
    throw err;
  } 
})();
*/
   
