import dotenv from 'dotenv';


import mongooseconnect from './db/index.js';
dotenv.config({ path: './.env' });

mongooseconnect();

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
   
