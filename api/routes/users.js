const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User
        .find()
        .select('_id firstname surname position address phonenumber email password')
        .exec()
        .then(docs => {
            if (docs.length == 0)
                res.status(404).json({
                    message: 'No entries found'
                })
            else {
                console.log(docs);
                res.status(200).json({
                    count: docs.length,
                    users: docs.map(doc => {
                        return {
                            _id: doc._id,
                            firstname: doc.firstname,
                            surname: doc.surname,
                            position: doc.position,
                            address: doc.address,
                            phonenumber: doc.phonenumber,
                            email: doc.email,
                            password: doc.password,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/' + doc._id
                            }
                        }

                    })
                });
            }
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
            res.status(201).json({
              message: "Created user successfully",
              createdUser: {
                _id: result._id,
                firstname: result.firstname,
                surname: result.surname,
                position: result.position,
                address: result.address,
                phonenumber: result.phonenumber,
                email: result.email,
                password: result.password,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/users/" + result._id,
                },
              },
            });
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
    .select('_id firstname surname position address phonenumber email password')
        .exec()
        .then(docs => {
            console.log("resources successfully fetched");
            if (docs)
                res.status(200).json({
                    user: docs,
                    request: {
                        type: 'GET',
                        description: 'Get all registered users',
                        url: 'http://localhost:3000/users/'
                    }
                });
            else
                res.status(404).json({message: 'No valid entry for provided ID'});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User
        .findById(id)
        .select('_id firstname surname position address phonenumber email password')
        .exec()
        .then(user => {
            if (user) {
                user.firstname = req.body.firstname || user.firstnamw;
                user.surname = req.body.surname || user.surname;
                user.position = req.body.position || user.position;
                user.address = req.body.address || user.address;
                user.phonenumber = req.body.phonenumber || user.phonenumber;
                user.email = req.body.email || user.email;
                user.password = req.body.password || user.password;
                user.save();
                res.status(200).json({
                    message: 'User created successfully',
                    user: user,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users/' + user._id
                    }
                });
            }
            else
                res.status(404).json({message: 'No valid entry for provided ID'})
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
        .deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount == 0) {
                res.status(404).json({message: 'No valid entry for provided ID'})
            } else {
                console.log(result);
                res.status(200).json({
                  message: "user deleted successfully",
                  request: {
                    type: "POST",
                    url: "http://localhost:3000/users",
                    body: {
                      firstname: "String",
                      surname: "String",
                      position: "String",
                      address: {
                        street: "String",
                        building: "Number",
                        zipcode: "Number",
                        city: "String",
                        country: "String",
                      },
                      phonenumber: "String",
                      email: "String",
                      password: "String",
                    },
                  },
                });
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