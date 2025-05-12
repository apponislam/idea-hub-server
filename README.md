# IdeaHub - Idea Sharing and Voting Platform

IdeaHub is a full-stack web application that allows users to share, vote, and comment on ideas. It includes features like user authentication, idea management, voting system, comments, categories, and payment integration.

## Features

-   **User Authentication**: Register, login, and manage user profiles
-   **Idea Management**: Create, read, update, and delete ideas
-   **Voting System**: Users can vote on ideas they like
-   **Comments**: Discussion system for each idea
-   **Categories**: Organize ideas into different categories
-   **Admin Dashboard**: Manage users, ideas, and payments
-   **Payment Integration**: Purchase premium ideas via ShurjoPay

## Live Demo

The application is live at: [https://idea-hub-server.vercel.app/](https://idea-hub-server.vercel.app/)

## Database Schema

![Database Diagram](https://i.ibb.co.com/j9PQq4T6/Blank-diagram.png)

## API Endpoints

### Authentication

-   `POST /api/v1/auth/login` - User login
-   `POST /api/v1/auth/refresh-token` - Refresh access token
-   `GET /api/v1/auth/me` - Get current user profile

### Users

-   `POST /api/v1/user/register` - Register new user
-   `GET /api/v1/user` - Get all users (admin only)
-   `PATCH /api/v1/user/:userId/role` - Update user role (admin only)
-   `PATCH /api/v1/user/:userId/activate` - Activate user (admin only)
-   `PATCH /api/v1/user/:userId/deactivate` - Deactivate user (admin only)
-   `PATCH /api/v1/user/:userId/delete` - Delete user (admin only)

### Ideas

-   `POST /api/v1/idea` - Create new idea
-   `GET /api/v1/idea` - Get all ideas
-   `GET /api/v1/idea/public/:ideaid` - Get single idea (public)
-   `GET /api/v1/idea/my-ideas` - Get current user's ideas
-   `GET /api/v1/idea/my-ideas/:id` - Get single idea (owner)
-   `PATCH /api/v1/idea/:id` - Update idea
-   `DELETE /api/v1/idea/:id` - Delete idea
-   `GET /api/v1/idea/adminideas` - Get all ideas (admin view)
-   `GET /api/v1/idea/adminideas/:id` - Get single idea (admin view)
-   `PATCH /api/v1/idea/:id/status` - Update idea status (admin only)

### Categories

-   `POST /api/v1/category` - Create category (admin only)
-   `GET /api/v1/category` - Get all categories
-   `GET /api/v1/category/:id` - Get single category
-   `PATCH /api/v1/category/:id` - Update category (admin only)
-   `DELETE /api/v1/category/:id` - Delete category (admin only)

### Votes

-   `POST /api/v1/vote/:ideaId` - Vote for an idea
-   `GET /api/v1/vote/:ideaId` - Get vote status for an idea

### Comments

-   `POST /api/v1/comment/:ideaId` - Add comment to idea
-   `GET /api/v1/comment/:ideaId` - Get all comments for an idea
-   `PATCH /api/v1/comment/:commentId` - Update comment
-   `DELETE /api/v1/comment/:commentId` - Delete comment

### Payments

-   `POST /api/v1/payment` - Create payment order
-   `GET /api/v1/payment/verify` - Verify payment
-   `GET /api/v1/payment/paymentsAdmin` - Get all payments (admin only)
-   `GET /api/v1/payment/my-purchases` - Get user's purchased ideas
-   `GET /api/v1/payment/my-purchases/:ideaId` - Verify specific purchase

## Project Structure

## Installation

```bash
# Clone the repository
git clone https://github.com/apponislam/idea-hub-server.git

# Navigate to the project directory
cd IdeaHub

# Install dependencies
npm install

# Set up environment variables
Create a .env file based on the configuration below

# Run the application
npm start
```

## Server Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://<username>:<password>@<host>/<database>?schema=public"

# Security
BCRYPT_SALT_ROUNDS=12
JWT_SECRET="your-strong-secret-here"
JWT_SECRET_EXPIRE=30d
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_SECRET_EXPIRE=365d

# ShurjoPay Payment Gateway
SP_ENDPOINT=https://sandbox.shurjopayment.com
SP_USERNAME=your_sp_username
SP_PASSWORD=your_sp_password
SP_PREFIX=SP
SP_RETURN_URL=http://localhost:3000/payment/verify
```

## Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: PostgreSQL
-   **Authentication**: JWT with refresh tokens
-   **Payment Gateway**: ShurjoPay
-   **Security**: Bcrypt for password hashing
-   **Environment**: Vercel for deployment

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

For any questions or suggestions, please contact [Appon Islam] at [11appon11@gmail.com].
