
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    department: String,
    id: Number,
    image: Array,
    price: Number,
    productDescription: String,
    productName: String
});

const reviewSchema = new mongoose.Schema({
    productName: String,
    productDescription: String,
    price: Number,
    department: String,
    image:Array,
    userId:String,
    productId:String,
    Status:String
});


const Product = mongoose.model('Products', productSchema);
const Review = mongoose.model('Reviews', reviewSchema);

module.exports = {
    Product,
    Review,
}

