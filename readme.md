# GET-A Web Application [SERVER]
**The server side of GET-A Web Application Project.**

## API
This repository provide the API for GET-A web application
- Analytic data API
- Learning course (offline/online) management API
- Member management API
- Payment API
- Review API
- Search API

## Ranking System
- Tutor Ranking: Applied AHP with RFM analytic
- Online Course Ranking: Wilson Lower bound Score

## System Requirement (Hardware)
- Minimum
    - CPU: 2 vCPUs
    - Memmory: 4 GB
- Recommended
    - CPU: Core I5 - 9300H
    - Memmory: 16 GB

## System Requirement (Software)
- OS: Ubuntu 20/Windows 10
- node JS: 14.17.0 or 15.14.0
- python 3.7: require libraries
  - pandas
  - numpy
  - scipy
  - PyMySQL

## Prerequisite
- SCB Open API Account
- Digitalocean Space

## Setup
- clone project
```
git clone https://github.com/orbitalno11/get-a-server.git
```
- install require dependencies
```
npm ci
```
- setup environment by create `.env` file in `root` of project fill this information
```
NODE_ENV=dev
PORT=9000  
  
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
  
SCB_SANDBOX_URL=
SCB_API_KEY=
SCB_API_SECRET=
SCB_BILLER_ID= 
SCB_MERCHANT_ID= 
SCB_TERMINAL_ID=  
SCB_REF3_PREFIX=
PAYMENT_CALLBACK_URL=
  
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DIGITAL_OCEAN_SPACE_CDN_ENDPOINT=
DIGITAL_OCEAN_SPACE_ENDPOINT=
```

## Starting server
- starting server `npm start`

## License
This project is a part of CSS491 Project Proposal and CSS492 Project Study of Applied Computer Science, Department of Mathematics, KMUTT
