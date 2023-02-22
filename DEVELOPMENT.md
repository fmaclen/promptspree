# Development

## Setup on your machine

1. Clone the repository
2. Download [Pocketbase](https://pocketbase.io/docs/) for your OS and unzip it on `/pocketbase`
3. Install dependencies from the root directory: `npm install`
4. Create a copy of `.env.sample` and name it `.env`, then edit with your own values.
5. In two different terminal sessions run:
   - `npm run backend` to start the Pocketbase server.
   - `npm start` to run the SvelteKit frontend.

## Deploy on a server

- Clone the repository on a [server](https://www.digitalocean.com/pricing/droplets#basic-droplets) with [Node.JS](https://nodejs.dev/en/download/) v18+: `git clone https://github.com/fmaclen/promptspree.git`

#### Setup backend

- Download the latest version of [Pocketbase](https://pocketbase.io/docs/) for your server's OS and unzip it on `/pocketbase`

#### Run deploy script

- From the root directory run `./scripts/deploy`, it will:
  - Pull the latest changes from the repository
  - Install dependencies
  - Build the frontend
  - Start (or restart) Pocketbase in a detached window, it will also apply any new migrations (accessible at `http://127.0.0.1:8090`)
  - Start (or restart) the SvelteKit frontend in a detached window (accessible at `http://localhost:3000`)
- Inspect if the process are running in the background with `ps aux | grep APP_NAME`


# WIP

# npm run backend
- run pocketbase on port 8090 - pocketbase/pb_data - pocketbase/pb_migrations

# npm run backend:test
- run pocketbase on port 8092 - tests/pocketbase/pb_data - tests/pocketbase/pb_migrations

# npm run dev
- set POCKETBASE_URL=127.0.0.1:8090
- run `npm run backend`
- run `npx vite dev --host`

# npm run dev:test
- set TEST_POCKETBASE_URL=127.0.0.1:8092
- run `npm run backend:test`
- run `npx vite dev --host`

# npm test
- wipe contents of tests/pocketbase/pb_data
- wipe contents of tests/pocketbase/pb_migrations
- copy pocketbase/pb_migrations to tests/pocketbase/pb_migrations
- run `npm run backend:test`
- set TEST_POCKETBASE_URL=127.0.0.1:8091
- run `npx playwright test --browser=firefox`

# npm test:trace test-results/etc/etc
- runs `npx playwright show-trace test-results/etc/etc`

# npm run setup
- runs `npm install`
- runs `npm run setup:pocketbase`

# npm run setup:pocketbase
- runs `node scripts/installPocketbase.js`
