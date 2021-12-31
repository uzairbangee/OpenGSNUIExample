# OpenGSNUIExample

Change the ourContract variable on line 15 in etherless.js file with the NovelCollection contract address.
Change the paymaster variable on line 16 in etherless.js file with the Paymaster contract address.

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
