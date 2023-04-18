const express = require('express');
const { type } = require('express/lib/response');
const router = express.Router();
const multer = require('multer');
const { raw } = require('body-parser');
const checkAuth  = require('../middleware/check-auth');

const productController = require('../controllers/productCont');


//manage file storage 
const storage = multer.diskStorage({

    //manage file storage destination
    destination: function (req, file, cb) {
        cb(null, './Images/sss');
    },

    //manage file naming
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

})

//filter file related data
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/png') {
        cb(null, true)
    } else {
        cb(new Error(file.mimetype + 'Is not valide'), false)
    }   
}

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 100000
    // },
    fileFilter: fileFilter
});


router.get('/', productController.get_all_products );

router.post('/', upload.single('productImage'), checkAuth, productController.post_products );

router.get('/:paramId', productController.get_productby_Id);

router.patch('/:paramId', productController.update_product);

router.delete('/:paramId', productController.delete_product);


module.exports = router; 