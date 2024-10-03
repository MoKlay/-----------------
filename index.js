const express = require('express')
const session = require('express-session')
const generate = require('./generate')
const fs = require('fs')
const body = require('body-parser')
const app = express()
const port = 80

const Set = {}
const BlockUser = {}
function getTime(time) {
    if (time.t == 's') {return time.v *1000}
    else if (time.t == 'm') {return time.v * 60 * 1000}
    else if (time.t == 'h') {return time.v * 3600 * 1000}
    else if (time.t == 'd') {return time.v * 86400 * 1000}

  }

  function setLoging(user, event) {
    let log = fs.readFileSync(__dirname + '/loging.log')
    if (log) {
        log += `${user};${event};${new Date(Date.now()).toLocaleDateString()};${new Date(Date.now()).toLocaleTimeString()}\n`
        fs.writeFileSync(__dirname + '/loging.log', log)
    }
  }
app.use(body.urlencoded({ extended: true }))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}))

app.use(express.json())
app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => res.send('Hello World!'))
app.get('/jquery', (req, res) => {
    res.sendFile(__dirname + '/jquery-3.7.1.min.js')
})

app.post('/api/generate', (req, res) => {
    const {login} = req.body
    const pass = generate(login.length)
    setLoging(req.session.login, 'Генерация пароля')
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
            if (role == 'user') setLoging(req.session.login, 'Создание пользователя')
            else if (role == 'admin') setLoging(req.session.login, 'Создание админа')
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
            setLoging(req.session.login, 'Удаление пользователя')
            res.json(users)
        })

    })

})
app.get('/users', (req, res) => {
    res.send(fs.readFileSync(__dirname + '/users/users.json'))
})
app.get('/getsettings', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(__dirname + '/setting.json')))
})



app.post('/auntification', (req, res) => {
    fs.readFile(__dirname + '/users/users.json', (err, data) => {
        const set = JSON.parse(fs.readFileSync(__dirname + '/setting.json'))
        const {login, pass} = req.body
        const users = JSON.parse(data)
        const user = users[login]
        if (BlockUser[login] && BlockUser[login] < Date.now()) {
            delete BlockUser[login]
        }
        if (user){
            if (!Set[login] && !BlockUser[login]) 
                Set[login] = set.trypass
            
            if (user.role !== "user") {
                if (!BlockUser[login] && user.pass === pass) {
                    delete Set[login]
                    req.session.login = login
                    setLoging(login, 'Аутентификация')
                    res.send()
                }
                else {
                    if (Set[login]) Set[login]--
                    if (Set[login] && Set[login] > 0) res.send({pass: `Неверный пароль! Попыток: ${Set[login]}`})
                    else {
                        delete Set[login]
                        if (!BlockUser[login]) BlockUser[login] = Date.now() + set.timeblock
                        res.send({err: `Пользователь заблокирован на ${set.timeblock / 60000} минут до ${new Date(BlockUser[login]).toLocaleTimeString()}`})
                    }
                }
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
app.post('/setsettings', (req, res) => {
    let {trypass, timeblock, timeOpen} = req.body
    let setting = {}
    trypass = parseInt(trypass)
    timeblock.v = parseInt(timeblock.v)
    timeOpen.v = parseInt(timeOpen.v)
    
    setting.trypass = trypass
    setting.timeblock = getTime(timeblock)
    setting.timeOpen = getTime(timeOpen)
    fs.writeFileSync(__dirname + '/setting.json', JSON.stringify(setting, null, 2))
    setLoging(req.session.login, 'Изиенение настроек')
    res.send(setting)
})
app.post('/exitinfo', (req, res) => {
    setLoging(req.session.login, 'Выход из системы')
    delete req.session.login
    res.send()
})
app.get('/insystem' , (req, res) => {
    if (req.session.login) res.send(true)
    else res.send(false)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))