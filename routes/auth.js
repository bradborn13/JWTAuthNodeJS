const router = require('express').Router();
const User = require('../model/User');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    registerValidation,
    loginValidation
} = require('../validation');


const schema = {
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
}
router.post('/register', async (req, res) => {
    //validate
    const {
        error
    } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    //User exists?
    const mailExists = await User.findOne({
        email: req.body.email
    });
    if (mailExists) {
        return res.status(400).send('Account already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPass,
    });
    try {
        const savedUser = await user.save();
        res.send({
            user: user._id
        });
    } catch (err) {
        res.status(400).send(err);
    }
});
router.post('/login', async (req, res) => {
    //validate
    const {
        error
    } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    // if email exists
    const user = await User.findOne({
        email: req.body.email
    });
    // user not found
    if (!user) {
        return res.status(400).send('Email not found');
    }
    //password doesnt match
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Password is wrong');
    // res.send(process.env.TOKEN_SECRET);

    //create and assign a token
    const token = jwt.sign({
            _id: user._id
        },
        process.env.TOKEN_SECRET
    );
    res.header('auth-token', token).send(token);

    // res.send('Logged in ');
});
module.exports = router;