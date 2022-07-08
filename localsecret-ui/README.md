# Local Secret UI

Simple all-in-one UI for various Local Secret services, faucet, block explorer, LCD endpoints etc.

## Build

### `npm install`

## Start
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Docker 

### To build with docker
`docker build -t local-secret-ui .`

### Run
`docker run --name local-secret-ui -p 0.0.0.0:3000:3000 local-secret-ui`

## Config

You can .env.defaults to .env and edit the config, or start the server with `REACT_APP_FAUCET_SERVER=https://faucet.scrttestnet.com npm start`