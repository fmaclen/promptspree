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

#### Backend

- Download the latest version of [Pocketbase](https://pocketbase.io/docs/) for your server's OS and unzip it on `/pocketbase`
- Start Pocketbase by `cd pocketbase` and then serve it in a detached sreen: `screen -dmS pocketbase nohup ./pocketbase serve &`
- Pocketbase will run with default settings and will be accessible at `http://127.0.0.1:8090`

#### Frontend

- Back to the root of the repository: `cd ..`
- Create a copy of `.env.sample` and name it `.env`, then edit with your own values.
- Run `./scripts/deploy` that:
  - Pulls the latest changes from Github
  - Builds the app
  - Kill the process of the existing server (if any)
  - Starts the server in a detached screen (on port `3000`)

**Note:** if deploy script doesn't work try `chmod +x ./scripts/deploy`
