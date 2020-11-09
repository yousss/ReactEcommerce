const express = require("express");
const mongoose = require('mongoose');
const { logErrors, clientErrorHandler, handleError } = require("./helpers/error");
const productRouter = require("./routers/productRouter");
const dotenv = require('dotenv')
const userRouter = require('./routers/userRouter')

dotenv.config()

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true }))
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/ecommercereact', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)

app.get('/', (req, res) => {
    res.send('Server is ready')
})

app.use(logErrors)
app.use(clientErrorHandler)
app.use(handleError)


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(' Server is at http://localhost ' + port)
})