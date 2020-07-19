const User = require('../../models/user');
const { ROLE } = require("./roles");
const roles = require('./roles');
const e = require('express');

const authGetUsers = (req, res, next) => {
    User.findById(req.userData._id)
        .select('position')
        .exec()
        .then(user => {
            if (req.params.userId) {
                if (req.params.userId === req.userData._id || user.position === ROLE.ADMIN) {
                    next();
                } else {
                    res.status(403).json({
                        message: "Unauthorized request"
                    })
                }
            } else if (user.position === ROLE.ADMIN) {
                next();
            } else {
                res.status(403).json({
                    message: "Unauthorized request"
                })
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
    })
}

const authPostUsers = (req, res, next) => {
    User.findById(req.userData._id)
        .select('position')
        .exec()
        .then(user => {
            if (user.position === ROLE.ADMIN) {
                next();
            } else {
                res.status(403).json({
                    message: "Unauthorized request"
                })
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
    })
}

// A user to be authorized to patch information of a any has to an admin OR any user is authorized to patch his/her own information
const authPatchUsers = (req, res, next) => {
    console.log(req.params.userId);
    User.findById(req.userData._id)
        .select('position _id')
        .exec()
        .then(user => {
            if (req.params.userId === req.userData._id || user.position === ROLE.ADMIN) {
                next();
            } else {
                res.status(403).json({
                    message: "Unauthorized request"
                })
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
    })
}

// Only admins can delete other users information
const authDeleteUsers = (req, res, next) => {
    User.findById(req.userData._id)
        .select('position')
        .exec()
        .then(user => {
            if (user.position === ROLE.ADMIN) {
                next();
            } else {
                res.status(403).json({
                    message: "Unauthorized request"
                })
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
    })
}

module.exports = {
    authGetUsers,
    authPostUsers,
    authPatchUsers,
    authDeleteUsers
}