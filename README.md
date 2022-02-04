# uteam-api

See .env.sample for .env suggestion.

Run "npm install" to install dependencies.

Run "npm start" in your terminal in order to start application.

Run "npm run dev" in your terminal to start your application in develoment enviorment.

Run 'http://localhost:"your_port"/' in your browser to see the response.

MODELS:

USER MODEL:

- ROUTES:
  - GET all users ('/users')
  - POST register user ('/register')
  - POST login user ('/login')
  - POST logout user ('/logout')

PROFILE MODEL:

- ROUTES:
  - GET all profiles ('/profiles')
  - GET profile by Id ('/profiles/:id')
  - POST create profile ('/profiles/:id')
  - PUT update profile ('/profiles/:id')
  - DELETE profile ('/profiles/:id')

COMPANY MODEL:

- GET all companies ('/companies)
- GET company by Id ('/companies/:id)
- POST create company ('/companies/:id)
- PUT update company ('/companies/:id)
- DELETE company ('/companies/:id)
