# Development

## Setup on your machine

1. Clone the repository
2. Install [Node.JS](https://nodejs.dev/en/download/) v18+
3. Install all dependencies: `npm run setup` (Node modules + Pocketbase)
4. Create a copy of `.env.sample` and name it `.env`, then edit with your own values.
5. In two different terminal windows run:
   - `npm run backend` to start the Pocketbase server on port `8090`.
   - `npm start` to run the SvelteKit frontend.

## Running tests

- `npm run test` to run all tests.
  - Note: it will erase previous test data.

#### Debugging tests

- Run the app using the data generated during a test, in two different terminal windows run:
  - `npm run backend:test` to start the Pocketbase server on port `8091`.
  - `npm run start:test` to run the frontend and connect to Pocketbase on port `8091`.
- `npm run test:trace test-results/some-test/trace.zip` to run Playwright's trace viewer.

## Deploy on a server

- Clone the repository on a [server](https://www.digitalocean.com/pricing/droplets#basic-droplets) with [Node.JS](https://nodejs.dev/en/download/) v18+: `git clone https://github.com/fmaclen/promptspree.git`

#### Run deploy script

- From the root directory in your server run `./scripts/deploy`, it will:
  - Pull the latest changes from the repository
  - Install dependencies
  - Build the frontend
  - Start (or restart) Pocketbase in a detached window, it will also apply any new migrations (accessible at `http://127.0.0.1:8090`)
  - Start (or restart) the SvelteKit frontend in a detached window (accessible at `http://localhost:3000`)
- Inspect if the process are running in the background with `ps aux | grep APP_NAME`
