const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/user')
const router = Router()

// /api/auth
router.post(
    '/register',
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Wrong password, minimal length 6 symbols').isLength({ min: 6 })
    ],
    async (request, responce) => {
        try {
            const errors = validationResult(request)

            if (!errors.isEmpty()) {
                return responce.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong data on registration'
                })
            }
            const { email, password } = request.body

            const candidate = await User.findOne({ email: email })

            if (candidate) {
                return responce.status(400).json({ message: 'This user already exists' })
            }

            const hashPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashPassword })

            await user.save()

            responce.status(201).json({ message: 'User created' })
        } catch (e) {
            responce.status(500).json({ message: 'Something went wrong, try again' })
        }
    })

// /api/login
router.post(
    '/login',
    [
        check('email', 'Wrong email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (request, responce) => {

        try {
            const errors = validationResult(request)

            if (!errors.isEmpty()) {
                return responce.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong data on login'
                })
            }

            const { email, password } = request.body

            const user = await User.findOne({ email })

            if (!user) {
                return responce.status(400).json({ message: 'That userd doesn\'t exists ' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return responce.status(400).json({ message: 'Wrong password, try again' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            responce.json({ token, userId: user.id })

        } catch (e) {
            responce.status(500).json({ message: 'Something went wrong, try again' })
        }

    })

module.exports = router