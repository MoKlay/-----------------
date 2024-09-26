const express = require('express')
const session = require('express-session')
const generate = require('./generate')
const fs = require('fs')
const body = require('body-parser')
const app = express()
const port = 80



app.use(body.urlencoded({ extended: true }))

app.use(express.json())
app.use(express.static(__dirname + '/createLogin'))


app.get('/', (req, res) => res.send('Hello World!'))
app.get('/jquery', (req, res) => {
    res.sendFile(__dirname + '/jquery-3.7.1.min.js')
})

app.post('/api/generate', (req, res) => {
    const {login} = req.body
    const pass = generate(login.length)
    
    res.json({login, pass})
})
app.post('/api/create', (req, res) => {
    const {login, pass, role} = req.body
    fs.readFile(__dirname + '/users/users.json', (err, data) => {
        
        if (err) {
            res.send('Ошибка чтения: ' + err)
        }
        const users = JSON.parse(data)
        
        users[login] = {pass, role}
        fs.writeFile(__dirname + '/users/users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                res.send('Ошибка записи: '+ err)
            }
            res.send()
        })

    })

})
app.post('/api/delete', (req, res) => {
    fs.readFile(__dirname + '/users/users.json', (err, data) => {
        if (err) {
            res.send('Ошибка чтения: ' + err)
        }
        const users = JSON.parse(data)
        delete users[req.body.login]
        fs.writeFile(__dirname + '/users/users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                res.send('Ошибка записи: '+ err)
            }
            res.json(users)
        })

    })

})
app.get('/users', (req, res) => {
    res.send(fs.readFileSync(__dirname + '/users/users.json'))
})



app.post('/auntification', (req, res) => {
    fs.readFile(__dirname + '/users/users.json', (err, data) => {
        const {login, pass} = req.body
        const users = JSON.parse(data)
        const user = users[login]
        if (user){
            if (user.role !== "user") {
                if (user.pass === pass) {
                    res.send()
                }
                else res.send({pass: 'Неверный пароль'})
            }
            else {
                res.send({err: 'Пользователь не может входить!'})
            }
        }
        else {
            res.send({login: 'Неверный логин'})
        }

    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))