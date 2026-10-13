const {DateTime} = require('luxon')
const {CARS, get_cars} = require('./_shared/db')

const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}

exports.handler = async (event) => {
    try {
        const vals = await get_cars()

        if (event.queryStringParameters?.unix) {
            const unix = {}
            for (const car of CARS) {
                const date = DateTime.fromJSDate(new Date(vals[car].split('-')[1]))
                unix[car] = parseInt(date.toMillis() / 1000)
            }
            return {statusCode: 200, headers, body: JSON.stringify(unix)}
        }

        return {statusCode: 200, headers, body: JSON.stringify(vals)}
    } catch (err) {
        console.error(err)
        return {statusCode: 500, headers, body: 'error reading db'}
    }
}
