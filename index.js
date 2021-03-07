import express from 'express';//modern way (to enable this put "type":"module" below "main" in pacjage.json)
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';  
import dotenv from 'dotenv';

dotenv.config();
const app = express();//express server

//middlewares
app.use(bodyParser.json({limit:"30mb",extended: true}));//so that we can parse large size image // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({limit:"30mb",extended: true}));// to support URL-encoded bodies
app.use(cors());


//importing routes
import postRoutes from './routes/posts.js' //dont miss .js 
app.use('/posts',postRoutes);//post route

import userRoutes from './routes/users.js'
app.use('/user',userRoutes);//user route


//connecting to database(mongodb cloud atlas version)
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
})
.then(()=>app.listen(PORT,() => console.log(`server running on port: ${PORT}`)) )
.catch((err) => console.log(err));

//listening to server\
//app.listen(PORT);

