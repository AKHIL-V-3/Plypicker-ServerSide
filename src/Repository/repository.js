
const { User } = require("../Modals/authModal")
const { Product, Review } = require("../Modals/productModal")

const authRepository = () => {

    const signUp = async (user) => {
        try {
            const newUser = new User({
                email: user.email,
                password: user.password,
                admin: user.admin,
            })
            const response = await newUser.save()
            return response
        } catch (err) {
            if (err.code === 11000) {
                throw new Error("Email already used");
            }
            throw err
        }
    }

    const signIn = async (user) => {
        try {
            const response = await User.findOne({ email: user.email })
            if (response) {
                return response
            } else {
                return new Error("User not found")
            }
        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }
    }


    const addProducts = async (data) => {

        try {

            const newProduct = new Product({
                department: data.department,
                id: data.id,
                image: [data.image],
                price: data.price,
                productDescription: data.productDescription,
                productName: data.productName
            })

            await newProduct.save()

        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }


    }

    const getProducts = async () => {
        try {
            const response = await Product.find({})
            if (response) {
                return response
            } else {
                return new Error("User not found")
            }
        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }

    }

    const viewproduct = async (proId) => {
        try {
            const response = await Product.findOne({ _id: proId })
            if (response) {
                return response
            } else {
                return new Error("product not found")
            }
        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }

    }

    const addUserreview = async (reviewData, image) => {
        try {
            const newReview = new Review({
                productName: reviewData.productName,
                productDescription: reviewData.productDescription,
                price: reviewData.price,
                department: reviewData.department,
                image: image,
                userId: reviewData.userId,
                productId: reviewData.productId,
                Status: "Pending"
            })
            await newReview.save()
        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }
    }

    const EditProduct = async (productData, images) => {

        try {

            const newProduct = {
                productName: productData.productName,
                productDescription: productData.productDescription,
                price: productData.price,
                department: productData.department,
                image: images,
            }

            const response = await Product.findOneAndUpdate(
                {
                    _id: productData.productId
                },
                newProduct,
                {
                    new: true
                }
            )

            if (response) {
                return response
            } else {
                throw "something went wrong"
            }


        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }
    }

    const getAllreviewProducts = async () => {
        try {
            const response = await Review.find({})
            if (response) {
                return response
            } else {
                return new Error("product not found")
            }
        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }

    }
    const getReviewProduct = async (proId) => {
        try {
            const response = await Review.findOne({ productId: proId })
            if (response) {
                return response
            } else {
                return new Error("product not found")
            }
        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }

    }

    const changeReviewStatus = async (productId) => {
        try {
            const response = await Review.findOneAndUpdate(
                { productId: productId },
                { Status: "Accepted" },
                { new: true }
            )

            if (response) {
                return response
            } else {
                return new Error("product not found")
            }
        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }
    }
    const getUserrequest = async (userId) => {
        try {
            const response = await Review.find({userId:userId})

            if (response) {
                return response
            } else {
                return new Error("product not found")
            }
        } catch (err) {
            console.log(err, 'repository err');
            throw err
        }
    }





    return {
        signUp,
        signIn,
        getProducts,
        viewproduct,
        addUserreview,
        EditProduct,
        addProducts,
        getAllreviewProducts,
        getReviewProduct,
        changeReviewStatus,
        getUserrequest

    }
}

module.exports = authRepository
