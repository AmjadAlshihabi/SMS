const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Product
        .find()
        .exec()
        .then(docs => {
            if (doc.length == 0) { 
                res.status(404).json({
                     message: 'No entries found'
                })
            } else {
                res.status(200).json(docs); 
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        category: req.body.category,
        weight: req.body.weight,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
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
        .exec()
        .then(doc => {
            console.log("From database: ", doc);
            if (doc)
                res.status(200).json(doc);
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
        .exec()
        .then(product => {
            if (product) {
                product.category = req.body.category || product.category;
                product.weight = req.body.weight || product.weight;
                Product.price = req.body.price || product.price;
                product.save();
                res.status(200).json({
                    message: "the product has been updated successfully",
                    product: product,
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
    Product.remove({ _id: id })
        .exec()
        .then(result=>{
            res.status(200).json({result})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;