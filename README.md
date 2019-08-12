# EXAMPLE OF GRAPHQL APP USING EXPRESS

## How to run

Just do like node js application 

`npm i`

you need nodemon to serve

`npm i -g nodemon`

create .env file with params:

    TOKEN_SECRET={some secret to generate token}
    REFRESH_TOKEN_SECRET={some secret to generate refresh token}
    TOKEN_LIFE={how long token can survive}
    REFRESH_TOKEN_LIFE={how long refresh token can survive}

then you can run

`npm start`

or you can directly run the server using

`node index.js`

that's all

PS: to use database for user data, you can go to ./db
there is knexfile.js that contain database settings, change according to your local database settings
Docs: http://knexjs.org/

## Debug

Go to http://localhost:4000/graph

those are graphiql UI to test your app
