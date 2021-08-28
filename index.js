const fs = require('fs')
const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())
const port = 3000


app.get('/timpark/api/get', (req, res) => {
    fs.readFile('./db/db.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.send('error')
        }
        res.send(data)
    })
})

app.get('/timpark/api/set', (req, res) => {
    let content = req.query.floor

    fs.writeFile('./db/db.txt', content, err => {
        if (err) {
            console.error(err)
            res.send('error')
        }
        res.send('success')
    })
})

app.listen(port, () => {
    console.log(`ParkWhere app listening at http://localhost:${port}`)
})
