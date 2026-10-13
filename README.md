## Configuration
Deployed on Netlify (site `illustrious-custard-9ed9c5`). The static page is served from `public/`, and the API runs as Netlify functions in `netlify/functions/`, mapped to `/parkwhere/api/*` by `netlify.toml`.

Set these as Netlify environment variables (secret):
```
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

The daily idle check (`netlify/functions/notify-idle.js`) also needs:
```
EMAIL_SERVER_HOST=example.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=me@example.com
EMAIL_SERVER_PASSWORD=hunter2
EMAIL_FROM='MyApp <me@example.com>'
EMAIL_TO=me2@example.com
```

Car floor data is stored in Upstash Redis. Missing cars are seeded on the first read, so an empty database works on first run.

For local development, put the Upstash variables in `.env` and run `npm run dev` (`netlify dev`).
