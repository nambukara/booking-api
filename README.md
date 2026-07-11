# EN2H Booking Platform REST API

## Project Overview
This project is a RESTful API built with **NestJS**, **TypeScript**, and **PostgreSQL** using **Prisma ORM**. It was developed as a technical assignment for the EN2H Software Engineer Intern position. The API allows authenticated administrators to manage available services while enabling unauthenticated customers to book appointments dynamically. 

The architecture strictly adheres to enterprise NestJS standards, featuring the **Repository Pattern** to decouple database interactions from core business logic, strongly typed Data Transfer Objects (DTOs), and centralized global exception handling.

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-link>
   cd booking-api
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Variables
The application relies on environment variables for configuration. A template file has been provided.

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your actual PostgreSQL connection string and a secure JWT Secret:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/booking_platform?schema=public"
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES=1d
   ```

## Database Setup & Running Migrations
This project uses **Prisma** to manage the database schema.

1. Ensure your PostgreSQL instance is running.
2. Push the schema to the database (or run migrations):
   ```bash
   npx prisma migrate dev --name init
   ```
3. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```

## Running the Application

**Using Docker (Recommended)**
You can easily spin up both the API and a PostgreSQL database using Docker Compose:
```bash
docker-compose up -d --build
```

**Running Locally**
To run the NestJS server locally on your machine:
```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run build
npm run start:prod
```

## API Documentation
The API is fully documented using **Swagger UI**. 
Once the application is running, navigate to:
**[http://localhost:3000/api](http://localhost:3000/api)**

You will find a complete interactive layout of all endpoints, required payloads, and schemas. You can use the "Authorize" button to inject your JWT token and test protected endpoints directly from the browser!

## Assumptions Made
1. **Service Independence**: A booking must belong to one valid service. The system verifies service existence before allowing a booking.
2. **Timezones**: All incoming dates and times are handled in UTC to avoid local server timezone conflicts when comparing against the current date.
3. **Public Booking**: Anyone can hit the `POST /bookings` endpoint to create a booking without needing an account. However, managing those bookings and managing services is restricted to authenticated admins via a Bearer JWT Token.
4. **Duplicate Prevention**: If a user attempts to book the exact same service on the exact same date and exact same time as a non-cancelled existing booking, the request is rejected with a 409 Conflict.

## Future Improvements
1. **Testing**: Expand the Jest testing suite to include comprehensive E2E tests for the Booking duplicate prevention logic using a mock database.
2. **Role-Based Access Control (RBAC)**: Currently, any authenticated user acts as an admin. Implementing `@Roles('ADMIN')` guards would allow for customer accounts in the future.
3. **Automated Reminders**: Integrate a queuing system like BullMQ to send automated email/SMS reminders 24 hours before a `CONFIRMED` booking.
4. **Soft Deletes**: Implement soft deletion (setting a `deleted_at` timestamp instead of physically removing records) to preserve historical analytical data for deleted services.