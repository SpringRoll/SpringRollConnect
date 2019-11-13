# SpringRoll Connect [![Build Status](https://travis-ci.org/SpringRoll/SpringRollConnect.svg)](https://travis-ci.org/SpringRoll/SpringRollConnect) [![Dependency Status](https://david-dm.org/SpringRoll/SpringRollConnect.svg)](https://david-dm.org/SpringRoll/SpringRollConnect) [![GitHub version](https://badge.fury.io/gh/SpringRoll%2FSpringRollConnect.svg)](http://badge.fury.io/gh/SpringRoll%2FSpringRollConnect)

SpringRoll Connect is a content management system built using [NodeJS](https://nodejs.org/), [Express](http://expressjs.com/) and [PostgreSQL](https://www.postgresql.org/). This app allows the easy deployment of SpringRoll apps and games.

## Requirements

- [NodeJS](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

1. Install the latest version of [Docker](https://www.docker.com/)
2. Copy `sample.env` to `.env`. You can modify these values, but for development you shouldn't have to
3. Run `npm run dev` which should build the PostgreSQL db server
4. You will have to manually create a PostgreSQL database, the default configuration settings are:

- `host: localhost`
- `user: postgres`
- `port: 5342`.
  Everything else can be left blank.

5. These settings are listed in the `.env` if you did want to modify them.
6. Once you have created the empty DB run `npm run db:init` this will populate the database with test data.

- Note: if you have any errors here ensure that your `.env` values match up with the connection values in the DB.

7. Run `npm start` which should start the application server
8. The website should then be available at `localhost:3000`.
9. The login credentials are always the role that you wish to sign in as (e.g. `user:admin` 1pass:admin`)

## Developing & Testing

- Once you have the database initialized you can start both the docker cotainer and the server itself with `npm run dev:full` for developing.
- If you want to run tests start **only** the DB (`npm run dev`) and use one of the testing commands found in `package.json`.

## License

Copyright (c) 2018 [SpringRoll](https://github.com/SpringRoll)

Released under the MIT License.
