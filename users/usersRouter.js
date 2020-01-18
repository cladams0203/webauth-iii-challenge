const router = require('express').Router()

const users = require('./usersModal')

router.get('/', (req,res) => {
    users.find()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: "failed to find users"})
        })
})

router.post('/register', (req,res) => {
    const { username, password } = req.body
    if(!username || !password) {
        res.status(403).json({message: 'invalid username and password'})
    }else{
        users.insert(req.body)
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
                res.status(200).json({message: 'login successful', username: username})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: 'failed to login'})
            })
    }
})

module.exports = router