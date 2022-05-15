
[toc]

# Introduction
Technical challenge including a signup/in part and a table displaying countries/districts inforamtion.

# Technical used

1. frontend
- React
- Umi
- Antd
- Echarts

2. backend
- NodeJS
- Koa
- MySQL

# Project structure


|-- basf-challenge
    |-- .gitignore
    |-- README.md
    |-- package.json
    |-- pnpm-lock.yaml
    |-- backend                    // backend directory
    |   |-- .eslintrc.js
    |   |-- ecosystem.config.js
    |   |-- package.json
    |   |-- pnpm-lock.yaml
    |   |-- tsconfig.json
    |   |-- src                   // source code
    |       |-- app.ts           
    |       |-- index.ts          // boot file
    |       |-- config            // config for db, encryption keys
    |       |   |-- .prod.ts
    |       |   |-- index.ts
    |       |   |-- local.ts
    |       |   |-- prod.ts
    |       |-- controller        // main business logic
    |       |   |-- favorites.ts
    |       |   |-- user.ts
    |       |-- logger
    |       |   |-- index.ts
    |       |-- middlewares       
    |       |   |-- auth.ts
    |       |   |-- error.ts
    |       |   |-- unionRes.ts
    |       |-- model              // data model. connect with db
    |       |   |-- db.ts
    |       |   |-- favorites.ts
    |       |   |-- index.ts
    |       |   |-- user.ts
    |       |-- router              // definition of all api routes
    |       |   |-- countries.ts
    |       |   |-- favorites.ts
    |       |   |-- index.ts
    |       |   |-- user.ts
    |       |-- types                 // typescript types
    |           |-- favorites.d.ts
    |           |-- global.d.ts
    |           |-- user.d.ts
    |-- frontend
        |-- .editorconfig
        |-- .eslintrc.js
        |-- .gitignore
        |-- .prettierignore
        |-- .prettierrc
        |-- README.md
        |-- package.json
        |-- pnpm-lock.yaml
        |-- tsconfig.json
        |-- typings.d.ts
        |-- config
        |   |-- config.ts
        |-- mock
        |   |-- .gitkeep
        |-- src                         // source code
            |-- global.css
            |-- routes.ts
            |-- api                      // http requests
            |   |-- index.ts
            |   |-- request.ts
            |-- components               // common components
            |   |-- bar-chart
            |   |   |-- index.tsx
            |   |-- header
            |       |-- index.less
            |       |-- index.tsx
            |-- hooks                      // react hooks
            |   |-- useAuth.ts
            |   |-- useInput.ts
            |-- layouts                   // main page layout
            |   |-- index.less
            |   |-- index.tsx
            |-- pages                      // all pages
            |   |-- home
            |   |   |-- index.less
            |   |   |-- index.tsx
            |   |   |-- tableColumn.tsx
            |   |-- signin
            |       |-- index.less
            |       |-- index.tsx
            |-- types                      //typescript types
            |   |-- countries.d.ts
            |   |-- user.d.ts
            |-- wrappers                   // high order components
                |-- auth.tsx




# Run locally

### Prerequisites
- NodeJS v16.15.0+
- MySQL 5.7
- pnpm (install by run: npm install pnpm -g)

## backend

1. cd backend
2. install dependencies

```
pnpm install
```
3. config local db connection

edit backend/src/config/local.ts, update values based on your local MySQL configs.

for example:
```javascript
const config = {
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'basf'
  },
  ...
}
```

4. npm run dev

open http://localhost:3000/api/ping in the browser

If you see 'Forbidden', then you are good

## frontend

1. cd frontend

2. install dependencies

```
pnpm install
```
3. open dev server
```
npm start
```
4. open http://localhost:8080

# Deploy

1. add config file for production

add file backend/src/config/.prod.ts which has the same config keys but different values used to connect to online db.

2. build frontend

cd frontend

```
npm run deploy
```
3. build backend

cd backend

```
npm run deploy
```

if you see 'cp: src/config/.prod.ts: No such file or directory', then you need to finish step 1

4. you should now see a deploy.zip

distribute it by any means to a server and unzip

5. install dependencies
```
pnpm install
```

6. start the server
```
npm run serve:prod
```