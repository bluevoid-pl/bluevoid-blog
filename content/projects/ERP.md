---
title: "ERP - webapp"
client: "Self"
date: "2021-12-29"
img: "/assets/ShirtERP2.png"
description: "System zarządzania zleceniami dla drukarni koszulek."
tags:
  - "React"
  - "Mantine"
---

![ERP](/assets/ShirtERP_logo.png)

# ERP

System do zażądania drukarnią koszulek.

![Produkty](/assets/ShirtERP.png)
![Zamówienia](/assets/ShirtERP2.png)

### Licencja komercyjna

### License Proprietary

## Installation instructions

1. Install and configure postgresql v13.
2. Install node 16, yarn, git
3. Git clone this repository and select tag of version you want to use from master branch.
4. Run `yarn` in cloned folder to install dependencies, then run `yarn build` to build application UI.
5. Set env variables in .env file

   - In frontend specify server url

   ```
   SERVER_URL=http://api.erp.ct8.pl:1337
   ```

   - In backend specify, JWT Secret for application

   ```
   ADMIN_JWT_SECRET=secret_must_be_secure_and_random
   JWT_SECRET=secret_must_be_secure_and_random
   ```

   - In backend specify database credentials for postgresql v13 database

   ```
   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5432
   DATABASE_NAME=shirt
   DATABASE_USERNAME=shirt
   DATABASE_PASSWORD=shirt
   DATABASE_SSL=false
   ```

6. Server is now ready and can be started with `yarn prod` command
