# OpenGSNUIExample

Install dependencies

```
yarn
```

Bundle up libraries

```
browserify etherless.js | tr -dc '\0-\177' > bundle.js
```

Start the server

```
node app.js
```

Here we will be calling the mint function of Our collection contract without paying gas fees and Paymaster will be responsible to pay our gas fees.
