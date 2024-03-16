
const {User, Token} = require("../Modals/authModal")

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
    return {
        signUp,
        signIn,
    }
}

module.exports = authRepository
