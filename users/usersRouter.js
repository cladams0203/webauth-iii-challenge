const router = require('express').Router()
const bcrypt = require('bcryptjs')
const users = require('./usersModal')
const jwt = require('jsonwebtoken')

function generateToken(user) {
    const payload = {
        username: user.username,
    }
    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, process.env.JWT_SECRET || 'duh', options)
}

router.get('/', validateToken, (req,res) => {
    users.find()
        .then(user => {
            const {username, id, department} = user[0]
            res.status(200).json({username, id, department})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: "failed to find users"})
        })
})

router.post('/register', (req,res) => {
    const { username, password, department } = req.body
    if(!username || !password) {
        res.status(403).json({message: 'invalid username,  password, department'})
    }else{
        users.insert({username, password: bcrypt.hashSync(password, 4), department})
            .then(user => {
                res.status(200).json({message: 'register successful', username: username})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: 'failed to register'})
            })
    }

})

router.post('/login', (req,res) => {
    const { username, password } = req.body
    if(!username || !password) {
        res.status(403).json({message: 'invalid username and password'})
    }else{
        users.findByUsername(username)
            .then(user => {
                if(user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user)
                res.status(200).json({message: 'login successful', username: username, token})
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: 'failed to login'})
            })
    }
})

function validateToken(req,res,next) {
    const token = req.headers.authorization
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET || 'duh', (err, decodedToken) => {
            if(err) {
                res.status(401).json({message: 'token not valid'})
            }else{
                req.username = decodedToken
                next()
            }
        })
    }else{
        res.status(400).json({message: 'no auth token'})
    } 
}

module.exports = router