const repository = require("../Repository/authRepository")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const {
    signUp,
    signIn,
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
    return {
        signupWithEmail,
        signInWithEmail,
        userVerified,
        refreshUser,
        logout
    }
}
module.exports = authController