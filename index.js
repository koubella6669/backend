const express = require('express');
const connectDB = require('./config/db');
const app = express();
//Connect DB
connectDB();

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API Running');
});

//Define Routes


app.use('/auth', require('./Routes/Auth'));
app.use('/records', require('./Routes/ManageRecord'));



app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});