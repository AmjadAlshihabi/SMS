const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User
        .find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        firstname: req.body.firstname,
        surname: req.body.surname,
        position: req.body.position,
        address: {
            street: req.body.address.street,
            building: req.body.address.building,
            zipcode: req.body.address.zipcode,
            city: req.body.address.city,
            country: req.body.address.country
        },
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        password: req.body.password
    });
    user
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(doc => {
            console.log("resources successfully fetched");
            if (doc)
                res.status(200).json(doc);
            else
                res.status(404).json({message: 'No valid entry for provided ID'});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User
        .update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User
        .remove({ _id: id })
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