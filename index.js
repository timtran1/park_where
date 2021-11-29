const fs = require('fs')
const express = require('express')
var cors = require('cors')
const app = express()
app.use(cors())
const port = 3000


app.get('/timpark/api/get', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.send('error')
        }
        res.send(data)
    })
})

app.get('/timpark/api/set', (req, res) => {
    const content = req.query.floor
    const car = req.query.car

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.send('error reading db')
        }
        let vals = JSON.parse(data)
        vals[car] = content
        const new_data = JSON.stringify(vals)

        fs.writeFile('./db/db.json', new_data, err => {
            if (err) {
                console.error(err)
                res.send('error writing db')
            }
            res.send('success')
        })
    })
})

app.listen(port, () => {
    console.log(`ParkWhere app listening at http://localhost:${port}`)
})
