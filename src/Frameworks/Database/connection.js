const mongoose = require("mongoose")
require("dotenv").config()

 function Mongoose (){
    const mongoURI = process.env.MONGOURI
    return () => {
        mongoose.connect(mongoURI)
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch(error => {
                console.error('Error connecting to MongoDB:', error);
            });
    }
}
module.exports = Mongoose;