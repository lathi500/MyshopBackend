const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const orderController = require('../controllers/orderCont');

router.get('/:orderId', orderController.get_order_by_id )


router.get('/', orderController.get_all_orders);

router.post('/', orderController.post_order);

router.delete('/:orderId', checkAuth, orderController.delete_order);

module.exports = router; 