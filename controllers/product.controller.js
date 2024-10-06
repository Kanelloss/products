const Product = require('../models/product.model');
const logger = require('../logger/logger');

exports.findAll = async(req, res) => {
    console.log("Find all products");

    try {
        const result = await Product.find()
        res.json({status: true, data: result})
    } catch (err){
        res.json({status:false, data: err})
    }
}

exports.findOne = async(req, res) => {
    const ProductId = req.params.id;
    console.log("Find product with id: ", ProductId);

    try {
        const result = await Product.findById(ProductId);
        res.json({status:true, data: result});
    } catch(err) {
        res.json({status: false, data: err});
    }
}

exports.create = async(req, res) => {
    const newProduct = new Product ({
        product: req.body.product,
        cost: req.body.cost,
        description: req.body.description,
        quantity: req.body.quantity,
    });

    console.log("Insert product with id", req.body.id);

    try {
        const result = await newProduct.save();
        res.json({ status:true, data: result});
    } catch (err) {
        res.json({status: false, data: err})
    }
}

exports.update = async (req, res) => {
    const ProductId = req.params.id;
    console.log("Update product with id: ", ProductId);

    // Should not give the ability to change 'product' aka product name since it's unique and may create problems. If a product's name needs to be changed, it should be deleted and be recreated. 

    // TODO ->  Remove product, add functions GetProductByProductName, DeleteProductByProductName, maybe Update as well?

    const updateProduct = {
        product: req.body.product,
        cost: req.body.cost,
        description: req.body.description,
        quantity: req.body.quantity
    };

    try { 
        const result = await Product.findOneAndUpdate(
            {_id: ProductId},
            updateProduct
        )
        res.json({status: true, data: result});
    } catch (err) {
        res.json({status: false, data: err})
    }
}

exports.delete = async(req, res) => {
    const productId = req.params.id;

    console.log("Delete product with id: ", productId);

    try {
        const result = await Product.findOneAndDelete({_id: productId})
        res.json({ status: true, data: result});
    } catch (err) {
        res.json({ status: false, data: result});
    }
}





