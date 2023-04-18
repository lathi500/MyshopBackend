const Product = require('../models/product');
const mongoose = require('mongoose');

exports.get_all_products = (req, res, next) => {

    //select specified property
    Product.find().select("_id price name productImage").exec().then(docs => {
        //define our own way of presenting data
        const responce = {
            TotalData: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    Id: doc.id,
                    productImage: doc.productImage,
                    url: "http://localhost:3000/products/" + doc._id
                }
            })
        };

        res.status(200).json(responce);
    }).catch(
        error => {
            res.status(500).json(error);
        })
}

exports.post_products = (req, res, next) => {
    console.log(req.file);

    Product.find({ name: req.body.name, price: req.body.price }).exec().then(result => {
        console.log(result);
        if (result.length > 0) {
            res.status(401).json({
                message: "product allready exist"
            })
        }
        else {
            const product = new Product({
                _id: new mongoose.Types.ObjectId,
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path
            });

            //store data in database

            product.save().then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Hello, testing POST',
                    productData: {
                        name: result.name,
                        price: result.price,
                        Id: result._id,
                        productImage: result.productImage,
                        description: "Get Data From Here: http://localhost:3000/products/" + result._id
                    }
                })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
                console.log(err)
            });
        }
    }

    )


}

exports.get_productby_Id = (req, res, next) => {
    const id = req.params.paramId; // fetch perameter that sended with route name. EX: paramId
    Product.findById(id).select("_id price name productImage").exec()
        .then(
            doc => {
                console.log(doc);
                res.status(200).json(doc);
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.update_product = (req, res, next) => {
    const id = req.params.paramId;
    const updateDb = {};
    for (const ops of req.body) {
        updateDb[ops.propName] = ops.value;
    }

    Product.updateOne({ _id: id }, { $set: updateDb }, { new: true })
        .then(result => {
            console.log("result In patch ", result);
            res.status(200).json({
                message: 'Data Updated!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });

            //  'Get Data From Here: http://localhost:3000/products/' + _id
            // res.status(200).json({
            //     request: {
            //         
            //     }    
            // });
        }).catch(error => {
            // console.log("error :: ",error)
            res.status(500).json({
                message: "cannot find user data"
            })
        })

}

exports.delete_product = (req, res, next) => {
    const id = req.params.paramId;
    Product.find().deleteMany({ _id: id }).exec().then(result => {
        console.log(result),
            res.status(200).json({
                message: "Data Deleted! can re-post from shared URL!",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: { name: 'Ramesh', price: '2000' }
                }
            })
    }).catch(err => {
        res.status(500).json({
            Error: err
        })
    })
}