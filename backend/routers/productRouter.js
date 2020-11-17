const express = require('express');
const { products } = require('../data');
const Product = require('../models/productModel');
const expressAsyncHandler = require('express-async-handler')
const { isAuth, isAdmin } = require('../helpers/utils')


const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async(req, res) => {
    const products = await Product.find({});
    const totalProduct = await Product.estimatedDocumentCount()
    res.send({products, total: totalProduct});
}))

productRouter.get('/seed', expressAsyncHandler(async(req, res) => {
    // await Product.remove({});
    const createdProduct = await Product.insertMany(products)
    res.send({ createdProduct })
}))

productRouter.get('/filter', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    let { search, limit, skip } = req.query
    search = search || ''
    limit = parseInt(limit)
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(search);
    const totalProduct = await Product.estimatedDocumentCount()
    const products = await Product.find({
        $or: [
            { name: { $regex: searchRgx, $options: "i" } },
            { category: { $regex: searchRgx, $options: "i" } },
            { brand: { $regex: searchRgx, $options: "i" } },            
            { description: { $regex: searchRgx, $options: "i" } },
        ]
    })
    .limit( limit || 20)
    .skip(parseInt(skip) || 0)

    res.send({ products, total: totalProduct })
}))

productRouter.get('/:id', expressAsyncHandler(async(req, res)=>{
    const product = await Product.findById({_id: req.params.id})
    if(product) {
        res.send({product})
    }else {
        res.status(404).send({ message: 'Product not found'})
    }
}))

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product) {
        const removedProduct = await product.remove()
        res.send({ message: 'success deleted', product: removedProduct})
    } else {
        res.status(404).send({ message: 'Product not found '})
    }
}))

productRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        product.image = req.body.image;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        const updatedProduct = await product.save();
        res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
        res.status(404).send({ message: 'Product not found ' })
    }
}))

productRouter.post('/', isAuth, isAdmin,  expressAsyncHandler(async (req, res) => {
    if (req.body && !req.body.name ) {
        res.status(402).send({ message: 'Please enter name of product' })
        return
    }

    const product = await Product.findOne({ name: req.body.name })
    if(product) {
        res.status(409).send({ message: 'Name of product is duplicated', product })
        return
    }

    const newProduct = new Product({
        name : req.body.name,
        price : req.body.price,
        image : req.body.image,
        category : req.body.category,
        brand : req.body.brand,
        countInStock : req.body.countInStock,
        description : req.body.description,
        rating: 0,
        numReviews: 0,
    });
    const createdProduct = await newProduct.save();
    res.send({ message: 'Product Created', product: createdProduct });
}))




module.exports = productRouter