# SpringRoll Connect [![Build Status](https://travis-ci.org/SpringRoll/SpringRollConnect.svg)](https://travis-ci.org/SpringRoll/SpringRollConnect) [![Dependency Status](https://david-dm.org/SpringRoll/SpringRollConnect.svg)](https://david-dm.org/SpringRoll/SpringRollConnect) [![GitHub version](https://badge.fury.io/gh/SpringRoll%2FSpringRollConnect.svg)](http://badge.fury.io/gh/SpringRoll%2FSpringRollConnect)

SpringRoll Connect is a content management system built using [NodeJS](https://nodejs.org/), [Express](http://expressjs.com/) and [MongoDB](https://www.mongodb.org/). This app allows the easy deployment of SpringRoll apps and games.

## Requirements

* [NodeJS](https://nodejs.org/)
* [MongoDB](https://www.mongodb.org/)

## Installation

* Install the latest version of [Docker](https://www.docker.com/)
* Copy `sample.env` to `.env`. You can modify these values, but for development you shouldn't have to
* Run `docker-compose up --build` which should build both the mongo db server and start the node service
* The website should then be available at `localhost:3000`
* You can then seed the database with some information by running `node seed.js`

## License

Copyright (c) 2018 [SpringRoll](https://github.com/SpringRoll)

Released under the MIT License.
