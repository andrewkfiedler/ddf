
## To Build this Project

Java and JavaScript can be built with Maven without installing `node` or `npm` locally.

```
maven clean install
```

## Development with Webpack Dev Server

###Building
You can use the webpack dev server for rapid development without having to build with Maven and deploy bundles for every change.

* Install Chrome Canary
* Install `node` and `npm` locally or use [helper scripts](https://github.com/eirslett/frontend-maven-plugin#helper-scripts) to use the node and npm downloaded by Maven
* Install package.json with `npm`

```
yarn install
```
* Make sure an instance of `ddf` is running locally on port 8993

```
npm run startplus
```
* Will automatically open Chrome Canary for you to the correct page.
* On the Inspectable Pages tab copy the url for "http://localhost:8080/" and paste it into a new tab.  Treat this new tab as your dev tools for the other tab.  As such you can pull it into it's own window, etc.  
* Has a fix for quick open crashing.  Once that's merged back to the master for dev tools we can skip this step.
* Alternatively
```
npm start
```
* Open http://localhost:8080/ to test and debug.


###Testing
Automated tests are executed as part of the maven build but it is also possible to manually run 
the tests.

####Headless
Run `npm test` to execute the automated tests using PhantomJS.

Run `npm testplus` to execute the automated tests in a browser.
