const repository = require("../Repository/repository")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require("fs")
const express = require('express');
const https = require('https');
require('dotenv').config()
const axios = require("axios")

const {
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
} = repository()

const authController = () => {
    const signupWithEmail = async (req, res) => {
        try {
            const password = await bcrypt.hash(req.body.password, 10)
            const user = {
                email: req.body.email,
                password: password,
                admin: req.body.admin ? true : false
            }
            const response = await signUp(user)
            res.status(200).json(response)
        } catch (err) {
            console.error(err); // Log the error for debugging
            res.status(400).json({ message: err.message });
        }
    }
    const signInWithEmail = async (req, res) => {
        try {
            const user = {
                email: req.body.email,
                password: req.body.password,
            }
            const response = await signIn(user)
            const isvalid = await bcrypt.compare(user.password, response.password)
            if (isvalid) {
                const tokenSecret = process.env.TOKEN_SECRET
                if (req.cookies[process.env.ACCESS_TOKEN]) {
                    req.cookies[process.env.ACCESS_TOKEN] = "";
                }
                if (req.cookies[process.env.REFRESH_TOKEN]) {
                    req.cookies[process.env.REFRESH_TOKEN] = "";
                }
                const accessToken = jwt.sign({ userId: response._id }, tokenSecret, { expiresIn: '1hr' });
                const refreshToken = jwt.sign({ userId: response._id }, tokenSecret, { expiresIn: '365d' });


                res.cookie(process.env.ACCESS_TOKEN, accessToken, {
                    path: '/',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
                    httpOnly: true,
                    sameSite: "lax",
                })
                res.cookie(process.env.REFRESH_TOKEN, refreshToken, {
                    path: '/',
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                })
                const userData = {
                    email: response.email,
                    userId: response._id,
                    admin: response.admin,
                    createdAt: response.createdAt
                }
                res.status(200).json(userData)
            } else {
                res.status(400).json({ message: "Incorrect Password" })
            }
        } catch (err) {
            if (err.message === "data and hash arguments required") {
                res.status(400).json({ message: "User not found" });
            }
        }
    }

    const userVerified = (req, res) => {
        const userId = req.params.userId
        console.log('userVerified');
        res.status(200).json({ message: "userverified" })
    }
    const refreshUser = async (req, res) => {
        const tokenSecret = process.env.TOKEN_SECRET;
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(400).json({ message: "couldn't find token" })
        }
        jwt.verify(refreshToken, tokenSecret, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Authentication failed" })
            }
            const accessToken = jwt.sign({ id: user.id }, tokenSecret, {
                expiresIn: "10s"
            })
            res.cookie(process.env.ACCESS_TOKEN, accessToken, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                httpOnly: true,
                sameSite: "lax",
            })
            req.id = user.id
            res.status(200).json({ message: "token refreshed" })
        })
    }
    const logout = (req, res) => {
        res.clearCookie(`${process.env.ACCESS_TOKEN}`)
        req.cookies[`${process.env.ACCESS_TOKEN}`] = "";
        res.clearCookie(`${process.env.REFRESH_TOKEN}`)
        req.cookies[`${process.env.REFRESH_TOKEN}`] = "";
        res.status(200).json({ message: "Successfully Logged Out" })
    }

    const addproductfromapi = async(req,res)=>{

        const products = req.body
        products.data.forEach(async(element) => {
            const response = await addProducts(element)
            
        });

    }

    const getAllProducts = async (req, res) => {
        const response = await getProducts()
        res.status(200).json(response)
    }

    const viewProduct = async (req, res) => {
        try {
            const id = req?.params?.id
            const response = await viewproduct(id)
            res.status(200).json(response)

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message })
        }

    }

    const downloadAndSaveImage = async (imageUrl, index) => {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        const imagePath = path.join(__dirname,'..','..', 'public', `image${index}.png`);
        fs.writeFileSync(imagePath, buffer);
        return `/image${index}.png`; // Return the path to the saved image
      };

    const addUserReview = async (req, res) => {

        try {
            const reviewData = req.body
            const {images} = req.body
            const savedImagePaths = await Promise.all(
                images.map(async (base64Image, index) => {
                  const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
                  const imagePath = path.join(__dirname ,'..','..', 'public', `image${index}${reviewData.productId}.png`);
                  fs.writeFileSync(imagePath, base64Data, 'base64');
                  return `${process.env.SERVER_URL}/image${index}${reviewData.productId}.png`; // Return the path to the saved image
                })
              );

            const response = await addUserreview(reviewData,savedImagePaths)
            res.status(200).json(response)
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message })
        }

    }

    const editProduct = async (req,res)=>{
        try {
            const productData = req.body
            const {images} = req.body
            const savedImagePaths = await Promise.all(
                images.map(async (base64Image, index) => {
                  const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
                  const imagePath = path.join(__dirname ,'..','..', 'public', `image${index}${productData.productId}.png`);
                  fs.writeFileSync(imagePath, base64Data, 'base64');
                  return `${process.env.SERVER_URL}/image${index}${productData.productId}.png`; // Return the path to the saved image
                })
              );

            const response = await EditProduct(productData,savedImagePaths)
            res.status(200).json(response)

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message })
        }

         
    }


    const getreviewproducts = async(req,res)=>{
        try {
            const response = await getAllreviewProducts()
            res.status(200).json(response)
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message })
        }
            
    }

    const getSingleReviewProduct = async(req,res)=>{
        try {
            const proId = req.params.id
            const response = await getReviewProduct(proId)
            res.status(200).json(response)
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message })
        }
            
    }

    const userReqEdit = async(req,res)=>{
        try {
            const product = req.body
            const response = await EditProduct(product,req.body.image)
            if(response){
                 await changeReviewStatus(product.productId)
            }else{
                 res.status(500).json({message:"product is not updated"})
            }
            res.status(200).json(response)
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message })
        }
            
    }
    const getUserRequests = async(req,res)=>{
        try {
            const userId = req.params.id
            const response = await getUserrequest(userId)
            if(response){
                 res.status(200).json(response)
            }else{
                 res.status(500).json({message:"product is not updated"})
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message })
        }
            
    }





    return {
        signupWithEmail,
        signInWithEmail,
        userVerified,
        refreshUser,
        logout,
        getAllProducts,
        viewProduct,
        addUserReview,
        editProduct,
        addproductfromapi,
        getreviewproducts,
        getSingleReviewProduct,
        userReqEdit,
        getUserRequests
    }
}
module.exports = authController