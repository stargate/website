# Stargate.io Website

## How to run this project

1. You need to use ruby version >= 2.5.0
2. Install all the dependencies: 
   * `npm install` to install package.json dependencies 
   * ```
     bundle config --local path ./vendor/bundle
   	 bundle install
	 ```
	 to install gemfile dependencies
3. Run the project with `npm start`. This will run the jekyll serve script and will open the development URL.

## How to build this project

In order to build, you can run:

```
npm run build
npm run serve
```

This will build the production-like files and serve on http://localhost:8080.
