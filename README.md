# Nifty

Nifty is a powerful and easy-to-use note taking web application, designed to help student's improve memory retention.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/gashon/note-hive.git nifty
cd nifty
```

Install dependencies:

```
yarn
```

Setup env (contact an engineer for access)

```
sudo chmod +x ./tools/scripts/setup_doppler.sh
./tools/scripts/setup_doppler.sh
```

Run dev environment

```
git checkout [main|staging]
yarn dev
```

Open your browser and navigate to http://localhost:3000.

## Package Overview

`apps/api`: The express backend for the Nifty web app.

`apps/api-live`: The websocket backend for handling realtime note collaboration.

`apps/client`: The client-side application for the Nifty note taking application.

`packages/common`: Shared utilities and components between the client and server.

`packages/eslint-config-custom`: Custom ESLint configuration for the project.

`packages/oauth`: OAuth package with fix to an open node-oauth issue: https://github.com/jaredhanson/passport-google-oauth2/issues/87

`packages/server-lib`: Reusable server-side library for the application.

`packages/ui`: User interface components for the Nifty note taking application.

`tools/scripts`: Various utility scripts for the project.
