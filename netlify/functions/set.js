const {CARS, set_car} = require('./_shared/db')

const headers = {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'}

exports.handler = async (event) => {
    const {car, floor} = event.queryStringParameters || {}

    if (!CARS.includes(car) || !floor) {
        return {statusCode: 400, headers, body: 'invalid car or floor'}
    }

    try {
        await set_car(car, floor)
        return {statusCode: 200, headers, body: 'success'}
    } catch (err) {
        console.error(err)
        return {statusCode: 500, headers, body: 'error writing db'}
    }
}
