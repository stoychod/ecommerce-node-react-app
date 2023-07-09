# ecommerce-node-react-app
A simple ecommerce PERN application

The application was created with `Node.js`, `Express`, `PostgreSQL` and `Typescript` for the back-end. The user can create an account and login. Authentication is implemented
using `Passport.js` and `passport-local` *strategy*. The home page presents a list of products. If the user clicks on a product they a redirected to single product information
page where it can be added to the cart. On the cart page a product quantity can be changed or deleted from the cart. The checkout page is implemented using 
`Stripe`. After completing a purchase the user can view their shopping history. The static folder in the `production` branch contains compiled front-end files from this repository - [ecommerce-front-end](https://github.com/stoychod/e-commerce-frontend).
The app can be viewed live on **Fly.io** - [ecommerce-node-react-app](https://ecommerce-node-react-app.fly.dev/).
