const express = require('express')
const Order = require('../models/orderModel')

const expressAsyncHandler = require('express-async-handler')
const { isAuth, isAdmin } = require('../helpers/utils')

const orderRouter = express.Router()

orderRouter.post('/', isAuth, expressAsyncHandler(async(req, res) => {
    if(req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart is empty' })
    } else {
        const order = new Order({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice:  req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
            code: Date.now()
        })
        const createdOrder = await order.save()
        res.status(201).send({ message : 'New order Created', order: createdOrder })
    }
}))

orderRouter.get('/list', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  let { search, page } = req.query
  search = search || ''
  
  const limit = 20
  let skip = (page - 1) * limit;
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
  const searchRgx = rgx(search);
  const totalOrder = await Order.estimatedDocumentCount()

  const orders = await Order.find({
    $or: [
      { "orderItems.name": { $regex: searchRgx, $options: "i" }, },
      { "shippingAddress.postalCode":  { $regex: searchRgx, $options: "i" }},
      { "shippingAddress.fullName": { $regex: searchRgx, $options: "i" } },
      { "shippingAddress.address": { $regex: searchRgx, $options: "i" } },
      { "shippingAddress.city": { $regex: searchRgx, $options: "i" } },
      { "shippingAddress.country": { $regex: searchRgx, $options: "i" } },
      { "paymentMethod": { $regex: searchRgx, $options: "i" } },
    ]
  })
    .limit(limit)
    .skip(parseInt(skip) || 0)

  res.send({ orders, total: totalOrder })
}))

orderRouter.patch('/:id/delivery', isAuth, isAdmin, expressAsyncHandler( async(req, res) => {
  const order = await Order.findById(req.params.id)
  if(order) {
    order.isDelivered = true;
    order.deliveredAt =  Date.now();
    order.deliveredBy = {
      name: req.body.name,
      phone: req.body.phone,
      estimatedTime: req.body.estimatedTime,
      type: req.body.type 
    }
    const updatedOrder = await order.save()
    res.send({ message: 'Order delivered', order: updatedOrder, success: true })
  } else {
    res.status(404).send({ message: 'Order not found' })
  }
}))

orderRouter.get('/:id', isAuth, expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)
    if(order) {
        res.send(order)
    } else {
        res.status(404).send({ message: 'Order not found' })
    }
}))

orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address 
        }

        const updatedOrder = await order.save()
        res.send({ message: 'Order paid', order: updatedOrder})
    } else {
        res.status(404).send({ message: 'Order not found' })
    }
}))

orderRouter.get('/mine', isAuth, expressAsyncHandler(async(req, res) => {
    
    const orders = await Order.find({ user: req.user._id })
    res.send(orders)
}))

module.exports = orderRouter 