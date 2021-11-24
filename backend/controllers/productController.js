
const Product = require("../model/productModel")
const ErrorHandler = require("../utils/errorhandler")
const catchasyncerros = require('../middleware/catchAsyncErrors')
const ApiFeatures = require("../utils/apifeatures")

// Create Product
exports.createProduct = catchasyncerros( async (req, res, next) => {
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, product })
})


// Get All products
exports.getAllProducts = catchasyncerros(async (req, res) => {

    const resultPerPage = 5;
    const ProductCount = await Product.countDocuments();  

    const apiFeature = new ApiFeatures(Product.find(),req.query).search()
    .filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({ success: true, products});
});

// Update Product
exports.updateProduct = catchasyncerros((async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    console.log("Request Recieved")

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
        ProductCount,
    });
}));

// Delete Product
exports.deleteProduct = catchasyncerros( async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted Sucessfully"
    });
})


// Get Product Details

exports.getProductDetails = catchasyncerros( async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
})

