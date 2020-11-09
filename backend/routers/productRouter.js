const express = require('express');
const { products } = require('../data');
const Product = require('../models/productModel');
const expressAsyncHandler = require('express-async-handler')


const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async(req, res) => {
    const products = await Product.find({});
    res.send(products);
}))

productRouter.get('/seed', expressAsyncHandler(async(req, res) => {
    // await Product.remove({});
    const createdProduct = await Product.insertMany(products)
    res.send({ createdProduct })
}))

productRouter.get('/:id', expressAsyncHandler(async(req, res)=>{
    const product = await Product.findById({_id: req.params.id})
    if(product) {
        res.send({product})
    }else {
        res.status(404).send({ message: 'Product not found'})
    }
}))

module.exports = productRouter