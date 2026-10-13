const {schedule} = require('@netlify/functions')
const {DateTime} = require('luxon')
const nodemailer = require('nodemailer')
const {CARS, get_cars} = require('./_shared/db')

const DAY_MS = 24 * 60 * 60 * 1000

const transporter = () => nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

const notify = async (car, days) => {
    const text = `Your car "${car}" may run out of battery soon (idle for ${days} days).`
    const info = await transporter().sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: 'Your car may run out of battery soon',
        text,
        html: `<p>${text}</p>`,
    })
    console.log(`Message sent: ${info.messageId}`)
}

// hourly, same as the old cron: a car idle for a multiple of 7 whole days triggers an email
exports.handler = schedule('6 * * * *', async () => {
    const vals = await get_cars()
    const now = Date.now()

    for (const car of CARS) {
        const last_update = DateTime.fromJSDate(new Date(vals[car].split('-')[1])).toMillis()
        const days = Math.floor((now - last_update) / DAY_MS)

        if (days > 0 && days % 7 === 0) {
            console.log(`Car "${car}" has been idle for ${days} days`)
            await notify(car, days)
        }
    }

    return {statusCode: 200}
})
