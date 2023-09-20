# Node.js Authentication API

This is a simple Node.js API that demonstrates user authentication using JWT (JSON Web Tokens) and bcrypt for password hashing. The API allows users to register, login, access a protected dashboard route, and log out.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/SainathPoojary/js-backend-course.git
   ```

2. Navigate to the project directory:

   ```bash
   cd /js-backend-course/node-auth-api
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and add the following environment variables:

   ```dotenv
   PORT=3000
   SECRET_KEY=<your-secret-key>
   MONGODB_URI=<your-mongodb-uri>
   ```

5. Start the server:

   ```bash
   npm start
   ```

The server should now be running at `http://localhost:3000`.

## Authentication

This API uses JSON Web Tokens (JWT) for user authentication. To access the protected `/dashboard` route, you need to include the JWT token received during login in the request headers.

Example Header:

```
Authorization: Bearer <your-jwt-token>
```

## Postman Documentation

You can find detailed documentation and examples of how to use these API endpoints in Postman by clicking [here](https://documenter.getpostman.com/view/15365840/2s9YC7Rqtj).

## Conclusion

This Node.js API provides a basic implementation of user authentication. You can use it as a starting point for building more complex authentication systems in your applications.
