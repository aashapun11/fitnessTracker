const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const env = require('dotenv')
env.config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors({
  origin: process.env.CLIENT_URL, // e.g., https://your-frontend.onrender.com
  credentials: true               // allows cookies or Authorization headers
}));
app.use(bodyParser.json());

app.use(express.json());


mongoose.connect(process.env.mongo_URL,{

})
.then(()=>console.log("Connected Successfully"))
.catch((err)=>console.log("The errro is ", err));


app.use('/api/workouts', require('./routes/workoutsRoute'));
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/nutrition', require('./routes/nutritionRoute'));
app.use('/api/water', require('./routes/waterRoute'));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
  