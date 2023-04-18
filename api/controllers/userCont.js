const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

exports.sign_up = (req, res, next) => {

    User.find({ email: req.body.email }).exec().then(user => {
        console.log(user);
        if (user.length >= 1) {
            //409 conflict with resource allready have
            //402 unprocessible entity
            return res.status(409).json({
                message: 'mail allready exist'
            })
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId,
                        email: req.body.email,
                        password: hash
                    })
                    user.save().then(result => {
                        console.log(result);
                        res.status(200).json({
                            result: result
                        })
                    })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            })
                        })
                }
            })
        }
    })
}

exports.log_in = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Login failed'
            });
        }
        // console.log(user[0].password);
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            const token = jwt.sign({
                emil: req.body.email,
                password: req.body.password
            },
                process.env.JWT_SECRET_KEY,

                {
                    expiresIn: "1h"
                }

            );
            if (err) {
                return res.status(401).json({
                    message: 'Login failed'
                });
            }
            if (result) {

                return res.status(200).json({
                    message: 'succeeded',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth Failed.'
            });

        });
    })
}

exports.delete_UserData = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId }).exec().then(
        result => {
            res.status(200).json({
                message: "Data deleted..."
            })
        }
    )
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_all_userData = (req, res, next) => {
    User.find().then(doc => {
        const responce = {
            user: doc.map(dc => {
                return {
                    _id: dc._id,
                    emil: dc.email,
                    password: dc.password
                }
            })
        }

        res.status(200).json({ responce })
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
