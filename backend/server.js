const express = require('express');
const app = express();
const PORT = 3000;
const env = require('dotenv')
env.config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());


mongoose.connect(process.env.mongo_URL,{

})
.then(()=>console.log("Connected Successfully"))
.catch((err)=>console.log("The errro is ", err));


app.use('/api/workouts', require('./routes/workoutsRoute'));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
  