# uteam-api

See `.env.sample` for `.env` suggestion.

Run `"npm install"` to install dependencies.

Run `"npm start"` in your terminal in order to start application.

Run `"npm run dev"` in your terminal to start your application in develoment enviorment.

Run `'http://localhost:"your_port"/'` in your browser to see the response.

# MODELS:

## USER MODEL:

### **USER CREATION ATTRIBUTES:**

- **email** - required,
- **username** - required,
- **password** - required,
- **name** (profile) - required,
- **status** (profile) - not required, options: _"Pending"_, _"Published"_. Default: _"Pending"_,
- **profile photo** (valid url) - not required, default: _"https://www.pngkit.com/bigpic/u2q8u2o0w7o0o0u2/"_,
- **company_name** (company) - not required, default: _"username's company"_,
- **logo** (company) - not required, default: _"https://www.pngfind.com/pngs/m/665-6659827_enterprise-comments-default-company-logo-png-transparent-png.png"_,
- **slug** (company) - not required, generated from company_name

### ROUTES:

- **GET all users ('/users')** - return a list of all users. Client must provide a page number and a limit trough request (_eg. "http://localhost:8001/users?page=1&size=10"_) for pagination.
- **GET user by ID ('/users/:id')** - return one user with a valid id provided by client.
- **POST register user ('/users')** - create a new user, new user profile and new user company. In case client doesn't provide company name, it will be "username's company".
- **POST login user ('/users/login')** - login route. Returns a status OK and a token.

## PROFILE MODEL:

### PROFILE CREATION ATTRIBUTES:

- **name** (profile) - required,
- **status** (profile) - not required, options: _"Pending"_, _"Published"_. Default: _"Pending"_,
- **profile photo** (valid url) - not required, default: _"https://www.pngkit.com/bigpic/u2q8u2o0w7o0o0u2/"_,

### ROUTES:

- **GET all profiles ('/profiles')** - public route, returns a list of all profiles.
- **GET profile by ID ('/profile/:id')** - public route, return one profile with a valid id provided by client.
- **POST create profile ('/profiles/:id')** - create a NEW profile. Authentication needed (token).
- **PUT update profile ('/profiles/:id')** - update an existing profile. Client must be the owner of profile in order to update it. Must provide a valid profile ID. Authentication needed (token).
- **DELETE profile ('/profiles/:id')** - delete an existing profile. Client must be the owner of profile in order to delete it. Authentication needed (token).

## COMPANY MODEL:

### COMPANY CREATION ATTRIBUTES:

- **company_name** (company) - not required, default: _"username's company"_,
- **logo** (company) - not required, default: _"https://www.pngfind.com/pngs/m/665-6659827_enterprise-comments-default-company-logo-png-transparent-png.png"_,
- **slug** (company) - not required, generated from company_name

### ROUTES:

- **GET all companies ('/companies')** - public route, returns a list of all companies.
- **GET company by Id ('/companies/:id')** - public route, return one company with a valid id provided by client.
- **POST create company ('/companies')** - create a NEW company. Authentication needed (token).
- **PUT update company ('/companies/:id')** - update an existing company. Client must be the owner of company in order to update it. Must provide company ID. Authentication needed (token).
- **DELETE company ('/companies/:id')** - delete an existing company. Client must be the owner of company in order to delete it. Must provide a valid company ID. Authentication needed (token).

###Languages used:

This API is built with [Typescript](https://www.typescriptlang.org/) on [NodeJS](https://nodejs.org/en/) using [Express](https://expressjs.com/) framework. For database I was using [MySql](https://www.mysql.com/) in combination with [Sequelize ORM](https://sequelize.org/).
