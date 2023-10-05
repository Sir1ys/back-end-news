# Northcoders News API

## Introduction

`back-end-news` is a credible, open-source resource which gives an opportunity to interact with API and databases. Users can create various type of requests and check which data being retrieved. Our server provides a valuable opportunity to comprehend the distinctions among types if of requests and the specific errors users may encounter based on the mistakes they make.

## Usage

To get started with `back-end-news`, the hosted version of the product can be used. You can get started immediately at (https://back-end-news.onrender.com).

## Development

To be able to start development on `back-end-news` make sure that you have done the following steps:

1. Clone the repository and install dependencies:

git clone https://github.com/Sir1ys/back-end-news && npm install

2. Install the list of dependencies:

- dotenv;
- express;
- pg;
- pg-format;

3. Install the list of Dev dependencies:

- jest;
- jest-sorted;
- supertest;

4. You need to create 2 env files for using this project:

.env.test && .env.development

Also, you need to write your .env files using the following exampl:

PGDATABASE=database_name_here

5. To start developing, run one or more of the commands in scripts section of the package.json:

- npm run setup-dbs - create databases;
- npm run seed - seed local database;
- npm run test - run tests;
- npm run playground - create a txt file in the main folder with the output of playground.sql file;
- npm run start - start listening to the app server;

6. If you want to a json representation of all the available endpoints of the api make a GET reqeust to /api route.

7. The minimum versions of Node is 18.13.0 and Postgres - 8.11.3 are needed to run this project.

The development environment should now be set up. Happy hacking! 👾
