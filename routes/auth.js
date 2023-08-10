const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { json } = require('express');
const JWT_SECRET="sdhsvhcb65c2ewc91cc2"


let success = false


router.post('/login', async (req, res) => {
    
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username:username,password:password })
        if (!user) {
            success = false
            return res.status(400).json({success,error: "Please enter correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({ success:success, authtoken:authToken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error Occured")
    }
})



module.exports = router