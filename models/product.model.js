const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let productSchema = new Schema({
    product: {
        type: String,
        required: [true, 'Product is required field'],
        max: 100,
        unique: true,
        trim: true,
        lowercase: true
    },
    cost: {
        type: Number,
        required: [true, 'Product cost is required field'],
        min: [0, 'Cost cannot be negative'],
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        max: 300,  
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [0, 'Quantity cannot be negative'],  
    },   
},{
    collection: 'products',
    timestamps: true
});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', productSchema)