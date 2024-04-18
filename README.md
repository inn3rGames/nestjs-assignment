## Summary

Fully working NestJS CRUD REST API with Roles-based access controls built with PostgreSQL, TypeORM, PassportJS, JWT, and Bcrypt.

## System Requirements

To get the repository up and running ensure that your system has the following software installed:

- Docker and Docker Compose with Docker Desktop being recommended

- NodeJS

- A SQL GUI editor like Beekeeper Studio, TablePlus, or pgAdmin for data viewing

- An API tool like Postman or Insomnia for interacting with the API endpoints

- Optionally GitHub CLI for ease of cloning and installation

## Installation

1. Open your terminal and clone the repository using:

```bash
gh repo clone inn3rGames/nestjs-assignment
```

2. Navigate into the repository:

```bash
cd nestjs-assignment/
```

3. Run npm install:

```bash
npm install
```

4. Build the container image (ensure that Docker is running):

```bash
docker compose build
```

5. Start the container:

```bash
docker compose up
```

6. If everything works well you will get the following message in your terminal:

![Start](/doc/assets/start.png)

## Usage

1. Open Postman and navigate to [http://localhost:3000/auth/register-admin](http://localhost:3000/auth/register-admin)

2. Send a `POST` request with the following body:

```json
{
  "username": "admin",
  "password": "admin"
}
```

3. You should expect the following answer in the response body:

```json
{
  "username": "admin",
  "roles": ["user", "admin"],
  "id": 1
}
```

4. Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

5. Send a `POST` request with the following body:

```json
{
  "username": "admin",
  "password": "admin"
}
```

6. You will receive a response with a JWT token response that will look like this:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwiaWF0IjoxNzEzNDMyOTIxLCJleHAiOjE3MTM1MTkzMjF9.6zEIE1jkA8Js3VNHywJzpIft64rGnOENbfYCITL6VXY"
}
```

7. Ensure that the access token is present in your authorization tab:

![Auth](/doc/assets/auth.png)

8. Navigate to [http://localhost:3000/cats](http://localhost:3000/cats)

9. Create a new cat profile by sending a `POST` request with the following body:

```json
{
  "name": "Bob",
  "age": 12,
  "breed": "bengal"
}
```

10. Your expected body response should be:

```json
{
  "name": "Bob",
  "age": 12,
  "breed": "bengal",
  "id": 1
}
```

11. Update your cat by sending a `PUT` request to [http://localhost:3000/cats/1](http://localhost:3000/cats/1) with the following body:

```json
{
  "name": "Jim",
  "age": 12,
  "breed": "bengal"
}
```

12. Your expected body response should be:

```json
{
  "id": 1,
  "name": "Jim",
  "age": 12,
  "breed": "bengal"
}
```

13. Navigate back to [http://localhost:3000/cats](http://localhost:3000/cats)

14. Create multiple new cat profiles by sending multiple `POST` requests with the following bodies:

```json
{
  "name": "Tim",
  "age": 6,
  "breed": "birman"
}
```

```json
{
  "name": "Lex",
  "age": 7,
  "breed": "bombay"
}
```

15. Mark `Lex` as your favorite cat by navigating to [http://localhost:3000/cats/favorite/3](http://localhost:3000/cats/favorite/3) and sending a `POST` request. You will receive the following response body:

```json
{
  "id": 1,
  "username": "admin",
  "roles": ["user", "admin"],
  "favorites": [
    {
      "id": 3,
      "name": "Lex",
      "age": 7,
      "breed": "bombay"
    }
  ]
}
```

16. You can always find the proof that Lex is the admin's favorite cat by navigating to [http://localhost:3000/cats/favorite/3](http://localhost:3000/cats/favorite/3) and sending a `GET` request. You will receive the following response body:

```json
{
  "id": 3,
  "name": "Lex",
  "age": 7,
  "breed": "bombay"
}
```

17. Remove `Lex` from the admin's favorite list by sending a `DELETE` request to [http://localhost:3000/cats/favorite/3](http://localhost:3000/cats/favorite/3). You will receive the following response body:

```json
{
  "id": 1,
  "username": "admin",
  "roles": ["user", "admin"],
  "favorites": []
}
```

18. Delete `Lex` completely from the database by sending a `DELETE` request to [http://localhost:3000/cats/3](http://localhost:3000/cats/3).

19. Verify that `Lex` is deleted by viewing the complete cats list. Navigate to [http://localhost:3000/cats/](http://localhost:3000/cats/) and send a `GET` request. You will receive the following response body:

```json
  {
    "id": 1,
    "name": "Jim",
    "age": 12,
    "breed": "bengal"
  },
  {
    "id": 2,
    "name": "Tim",
    "age": 6,
    "breed": "birman"
  }
```

20. Role-based access controls are fully implemented. Create a basic user by sending a `POST` request to [http://localhost:3000/register](http://localhost:3000/register) with the following body:

```json
{
  "username": "demo",
  "password": "demo"
}
```

21. Login with the demo user by sending a `POST` request to [http://localhost:3000/auth/login](http://localhost:3000/auth/login) and copy the access token that is returned by the response body.

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiZGVtbyIsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzEzNDM1NjAzLCJleHAiOjE3MTM1MjIwMDN9.u1NUXRyJeze3LWQg59GeQAdP1xmfIuCTFEJdKcHIWng"
}
```

22. Try to create a new cat profile while being logged in as a basic user. Send a `POST` request to [http://localhost:3000/cat](http://localhost:3000/cat) with the following body:

```json
{
  "name": "test",
  "age": 0,
  "breed": "test"
}
```

24. You will receive a response body that proves that you are not allowed to create cat profiles while being logged in as a basic user:

```json
{
    "message": "Forbidden resource",
    "error": "Forbidden",
    "statusCode": 403
}
```

25. Mark `Tim` as your favorite cat by navigating to [http://localhost:3000/cats/favorite/2](http://localhost:3000/cats/favorite/2) and sending a `POST` request. You will receive the following response body:

```json
{
    "id": 2,
    "username": "demo",
    "roles": [
        "user"
    ],
    "favorites": [
        {
            "id": 2,
            "name": "Tim",
            "age": 6,
            "breed": "birman"
        }
    ]
}
```

26. Open Beekeeper Studio. Login with the following details:
![Database login](/doc/assets/db-login.png)

27. Your database tables should look like this:

Users table
![Users](/doc/assets/users.png)

Cats table
![Cats](/doc/assets/cats.png)

Favorites table
![Favorites](/doc/assets/favorites.png)

## Tests

1. Unit tests:

```bash
npm run test
```

![Unit](/doc/assets/unit.png)

1. End-to-end tests:

```bash
npm run test:e2e
```

![Unit](/doc/assets/end.png)
