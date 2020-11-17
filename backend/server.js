const express = require("express");
const mongoose = require('mongoose');
const productRouter = require("./routers/productRouter");
const dotenv = require('dotenv')
const userRouter = require('./routers/userRouter');
const orderRouter = require("./routers/orderRouter");
const { uploadRouter } = require("./routers/uploadRouter");

dotenv.config()

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/ecommercereact', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.use('/api/uploads', uploadRouter)
app.use('/api/orders', orderRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_ID || 'sb')
})

app.get('/', (req, res) => {
    res.send('Server is ready')
})



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(' Server is at http://localhost ' + port)
})