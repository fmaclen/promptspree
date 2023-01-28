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

- Clone the repository on a [server](https://www.digitalocean.com/pricing/droplets#basic-droplets) with [Node.JS](https://nodejs.dev/en/download/) v18+: `git clone https://github.com/fmaclen/the-synthetic-gazette.git`

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
