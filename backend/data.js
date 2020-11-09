const bcrypt = require('bcrypt');

 const users = [
    {
        name: 'Yous',
        email: 'admin@yous.com',
        password: bcrypt.hashSync('1234',8),
        isAdmin: true
    },
    {
        name: 'Kola',
        email: 'kola@yous.com',
        password: bcrypt.hashSync('1234', 8),
        isAdmin: false
    }
];


const products = [
    {
        name:'testone',
        category: 'One',
        image: '/images/p1.jpg',
        price: 120,
        brand: 'Nice',
        rating: 4.5,
        numReviews: 10,
        countInStock: 10,
        description: 'high quality product'
    },
    {
        name: 'Nice taste',
        category: 'two',
        image: '/images/p2.jpg',
        price: 150,
        brand: 'Nice',
        rating: 4.5,
        numReviews: 10,
        countInStock: 200,
        description: 'high quality product'
    },
    {
        name: 'double taste',
        category: 'One',
        image: '/images/p3.jpg',
        price: 160,
        brand: 'Nice',
        rating: 4.0,
        numReviews: 10,
        countInStock: 0,
        description: 'high quality product'
    },
    {
        name: 'Third Tea',
        category: 'One',
        image: '/images/p4.jpg',
        price: 170,
        brand: 'Nice',
        rating: 3.5,
        numReviews: 10,
        countInStock: 600,
        description: 'high quality product'
    },
    {
        name: 'nice hong kong taste',
        category: 'One',
        image: '/images/p5.jpg',
        price: 180,
        brand: 'Liga',
        rating: 4.5,
        numReviews: 10,
        countInStock: 25,
        description: 'high quality product'
    }
];

module.exports = { products, users }