# Angular + Spring Boot JWT Authentication App

This is a full-stack web application with an Angular frontend and a Spring Boot backend using JWT (JSON Web Token) for authentication.

---

## 📁 Project Structure

### project-root/

### ├── client/ # Angular app

### └── server/ # Spring Boot app

---

## 🚀 Getting Started

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) (v22.18+ recommended)
- [Angular 19](https://angular.io/cli)
- [Java 21+](https://adoptopenjdk.net/)
- [Maven](https://maven.apache.org/) (or use Maven Wrapper `./mvnw`)
- [MySQL](https://www.mysql.com/)
- [Postman](https://www.postman.com/) or `curl` for API testing

---

## 🖥️ Backend - Spring Boot (server)

### 🔹 Setup & Run

```bash
cd server
./mvnw install      # If using Maven Wrapper
./mvnw spring-boot:run
```

🔹 Default Backend URL :

http://localhost:8080

---

💻 Frontend - Angular (client) :

🔹 Setup & Run

```bash
cd client
npm install
ng serve --o
```

🔹 Default Frontend URL :

http://localhost:4200

---

🔐 JWT Auth Flow :

🔹 API Endpoints (Spring Boot) :

Method Endpoint Description
POST /api/auth/login Authenticate user
POST /api/auth/register Register new user
GET /api/user/profile Protected route

---

🔹 PostMan Curl For Admin User:

```bash
curl -X POST 'http://localhost:8080/api/auth/register' \
-H 'Content-Type: application/json' \
-d '{
  "username": "amdouni",
  "email": "amdouni@gmail.com",
  "password": "123456",
  "firstName": "amdouni",
  "lastName": "abdenour",
  "roles": ["ADMIN"]
}'
```
