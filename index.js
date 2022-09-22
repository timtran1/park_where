const fs = require('fs')
const express = require('express')
const cors = require('cors')
const {DateTime} = require("luxon");
const nodemailer = require("nodemailer");
require('dotenv').config()

const app = express()
const mail_app = express()
app.use(cors())
mail_app.use(cors())
const port = 3000
const mail_app_port = 7000

const mail_config = {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_PORT === 456, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    }
}
const transporter = nodemailer.createTransport(mail_config);


// app.get('/check', (req, res) => {
//     console.log('check')
//     res.send('ok')
// })


app.get('/parkwhere/api/get', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.send('error')
        }

        if (req.query.unix) {
            const vals = JSON.parse(data)
            let m_vals = vals['mercedes'].split('-')
            let m_date = DateTime.fromJSDate(new Date(m_vals[1]))

            let t_vals = vals['toyota'].split('-')
            let t_date = DateTime.fromJSDate(new Date(t_vals[1]))

            res.send(JSON.stringify({
                mercedes: parseInt(m_date.toMillis() / 1000),
                toyota: parseInt(t_date.toMillis() / 1000),
            }))
        } else res.send(data)
    })
})

app.get('/parkwhere/api/set', (req, res) => {
    const content = req.query.floor
    const car = req.query.car

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.send('error reading db')
        }
        let vals = JSON.parse(data)
        vals[car] = content + '-' + new Date().toString()
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

mail_app.get('/notify', async (req, res) => {
    console.log('notify')

    const text = `Your car "${req.query.car}" may run out of battery soon (idle for ${req.query.days} days).`
    const html = `<p>${text}</p>`


    let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM, // sender address
        to: process.env.EMAIL_TO, // comma-separated string of receivers
        subject: 'Your car may run out of battery soon', // Subject line
        text, // plain text body
        html, // html body
    });

    const log = `Message sent: ${info.messageId}`
    console.log(log)
    res.send(log)
})


app.listen(port, () => {
    console.log(`ParkWhere app listening at http://localhost:${port}`)
})

mail_app.listen(mail_app_port, () => {
    console.log(`Mail server up`)
})
