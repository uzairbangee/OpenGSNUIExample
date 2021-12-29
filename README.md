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
