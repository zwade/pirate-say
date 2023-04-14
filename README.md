# PirateSay

A discord bot to let you speak like a pirate!

## Setup

1. Clone the repo

```bash
git clone git@github.com:zwade/pirate-say.git
```

2. Install dependencies and compile

```bash
yarn install
yarn tsc
```

3. Create a new discord application & bot, and OAuth with the server you want to join

4. Create a `.env` file

```bash
cat > .env <<EOF
DISCORD_TOKEN=...
CLIENT_ID=...
OPENAI_TOKEN=...
EOF
```

5. Start the server and speak like a pirate!

```bash
node dist/main.mjs
```