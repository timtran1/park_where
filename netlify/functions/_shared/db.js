const CARS = ['mercedes', 'toyota']
const DEFAULT_FLOOR = '1m'

const car_key = car => `parkwhere:${car}`

const redis = async (...command) => {
    const res = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
        method: 'POST',
        headers: {Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json'},
        body: JSON.stringify(command),
    })
    const json = await res.json()
    if (json.error) throw new Error(json.error)
    return json.result
}

// SET NX only writes missing keys, so seeding is safe to repeat and fills an empty db on first run
const seed_db = async () => {
    const now = new Date().toString()
    for (const car of CARS) {
        await redis('SET', car_key(car), `${DEFAULT_FLOOR}-${now}`, 'NX')
    }
}

const get_cars = async () => {
    let values = await redis('MGET', ...CARS.map(car_key))
    if (values.some(v => v === null)) {
        await seed_db()
        values = await redis('MGET', ...CARS.map(car_key))
    }
    return Object.fromEntries(CARS.map((car, i) => [car, values[i]]))
}

const set_car = (car, floor) => redis('SET', car_key(car), `${floor}-${new Date().toString()}`)

module.exports = {CARS, get_cars, set_car}
