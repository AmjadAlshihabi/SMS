const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('Multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/images');
    },
    filename: function (req, file, callback) {
        console.log("hello: "+file.originalname);
        callback(null, new Date().toISOString() + "." +file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype ==='image/png') {
        callback(null, true);
    } else {
        callback(null, false);
        }

};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    },
  fileFilter:fileFilter
});

router.get('/', (req, res, next) => {
    Product
        .find()
        .select("category weight price _id image")
        .exec()
        .then(docs => {
            if (docs.length == 0) { 
                res.status(404).json({
                     message: 'No entries found'
                })
            } else {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => { 
                        return {
                            category: doc.category,
                            weight: doc.weight,
                            price: doc.price,
                            _id: doc._id,
                            image: doc.image,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000 /products/' + doc._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "this is an error"
            })
        })
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log("hello: "+req.file.filename);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        category: req.body.category,
        weight: req.body.weight,
        price: req.body.price,
        image: req.file.path
    });
    console.log('here again: ' + req.file.path);
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    category: result.category,
                    weight: result.weight,
                    price: result.price,
                    _id: result._id,
                    image:result.image,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id 
                    }
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

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("category weight price _id image")
        .exec()
        .then(docs => {
            if (docs)
                res.status(200).json({
                    product: docs,
                    request: {
                        type: 'GET',
                        description: 'Gets all products',
                        url: 'http://localhost:3000/products'
                    }
                });
            else
                res.status(404).json({message: 'No valid entry for provided ID'});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product
        .findById(id)
        .select('category weight price _id')
        .exec()
        .then(product => {
            if (product) {
                product.category = req.body.category || product.category;
                product.weight = req.body.weight || product.weight;
                product.price = req.body.price || product.price;
                product.save();
                res.status(200).json({
                    message: "Product updated successfully",
                    product: product,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + product._id
                    }
                })
            }
            else
                res.status(404).json({message: 'No valid entry for provided ID'});
         })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount == 0) {
                res.status(404).json({message: 'No valid entry for provided ID'})
            } else {
                console.log(result);
                res.status(200).json({
                    message: 'product deleted successfully',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products',
                        body: {
                            category: 'String',
                            weight: 'Number',
                            price: 'Number'
                        }
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;