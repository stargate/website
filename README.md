# Stargate.io Website

## How to run this project

1. You need to use ruby version >= 2.5.0
2. Install all the dependencies: 
   ```bash
   npm ci
   bundle config --local path ./vendor/bundle
   bundle install
   ```
3. Run the project with `npm start`. This will run the jekyll serve script and will open the development URL.

## How to build this project

In order to build, you can run:

```bash
npm ci
npm run build
npm run serve
```

This will build the production-like files and serve on http://localhost:8080.
