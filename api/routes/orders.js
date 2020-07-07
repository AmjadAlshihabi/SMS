const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

router.get('/', (req, res, next) => {
    Order
        .find()
        .select('id products customer orderDate editor price')
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => { 
                    return { 
                        products: doc.products.map(doc => {
                            return {
                                productId: doc.productId,
                                quantity: doc.quantity,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/products/' + doc.productId
                                }
                            }
                            },
                        ),
                        customer: doc.customer,
                        orderDate: doc.orderDate,
                        editor: {
                            editorId: doc.editor,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/' + doc.editor
                            }
                        },
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            products: req.body.products,
            customer: {
                name: req.body.customer.name,
                address: {
                    street: req.body.customer.address.street,
                    building: req.body.customer.address.buidling,
                    zipcode: req.body.customer.address.zipcode,
                    city: req.body.customer.address.city,
                    country: req.body.customer.address.country
                },
                phonenumber: req.body.customer.phonenumber,
                email: req.body.customer.email
            },
            orderDate: new Date,
            editor: req.body.editor,
            price: req.body.price
        });
    
        order
            .save()
            .then(result => {
                res.status(201).json({
                    products: result.products.map(pro => {
                        return {
                            productId: pro.productId,
                            quantity: pro.quantity,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + pro.productId
                            }
                        }
                    }),
                    customer: result.customer,
                    orderDate: result.orderDate,
                    editor: {
                        editorId: result.editor,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + result.editor
                        }
                    },
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error:err
                })
            });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('id products customer orderDate editor price')
        .exec()
        .then(docs => {
            console.log("resources successfully fetched");
            if (docs){
                res.status(200).json({
                    products: docs.products.map(pro => {
                        return {
                            productId: pro.productId,
                            quantity: pro.quantity,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + pro.productId
                            }
                        }
                    }),
                    customer: docs.customer,
                    orderDate: docs.orderDate,
                    editor: {
                        editorId: docs.editor,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + docs.editor
                        }
                    },
                    price: docs.price,
                    _id: docs._id,
                    request: {
                        type: 'GET',
                        description: 'Get all orders',
                        url: 'http://localhost:3000/orders/'
                    }
                });
        }
            else
                res.status(404).json({message: 'No valid entry for provided ID'});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order
        .findById(id)
        .select('id products customer orderDate editor price')
        .exec()
        .then(order => {
            order.products = req.body.products || order.products;
            order.customer = req.body.customer || order.customer;
            order.orderDate = req.body.orderDate || order.orderDate;
            order.editor = req.body.editor || order.editor;
            order.price = req.body.price || order.price;
            order.save();
            res.status(200).json({
                products: order.products.map(pro => {
                    return {
                        productId: pro.productId,
                        quantity: pro.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + pro.productId
                        }
                    }
                }),
                customer: order.customer,
                orderDate: order.orderDate,
                editor: {
                    editorId: order.editor,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + order.editor
                    }
                },
                price: order.price,
                _id: order._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + order._id
                
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted successfully',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {
                        products: [{
                            productId: 'Product ID',
                            quantity: 'Number'
                        }],
                        customer: {
                            name: 'String',
                            address: {
                                street: 'String',
                                building: 'Number',
                                zipcode: 'Number',
                                city: 'String',
                                country: 'String'
                            },
                            phonenumber: 'String',
                            email: 'String'
                        },
                        editor: 'User ID',
                        price: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;