const Order = require('../models/order');

exports.get_all_orders = (req, res, next) => {
    Order.find().populate('product').then(doc => {
        const responce = {
            order: doc.map(dc => {
                return {
                    _id: dc._id,
                      productId: dc.productId,
                    orderQuintity: dc.quantity
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

exports.get_order_by_id = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).populate('product').select('_id product quantity').then(doc => {
        res.status(200).json(doc);
    })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
}

exports.post_order = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId).populate('product').then(presult => {
        if (!presult) {
            return res.status(400).json({
                message: "Product not found"
            })
        }
        else {  

            const order = new Order({
                _id: new mongoose.Types.ObjectId,
                product: req.body.productId,
                quantity: req.body.quantity
            })

            order.save().then(oresult => {
                res.status(200).json({
                    order: {
                        oresult
                    }
                });
            }).catch(err => {
                res.status(500).json({
                    error: err
                });
            })
        }
    })
}

exports.delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({ _id: id }).then(result => {
        res.status(200).json(result);
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
