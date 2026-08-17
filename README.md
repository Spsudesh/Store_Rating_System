# Store Rating System

A full-stack web application where users can rate stores, store owners can view ratings received for their stores, and admins can manage users, stores, and ratings.
we keep everything to  be simpler .. project is build for practise .

## Features

### Admin
- View dashboard summary with total users, stores, and ratings.
- Add new users with roles: Admin, User, and Store Owner.
- Add new stores and assign them to store owners.
- View, search, filter, and sort users.
- View user details.
- If the user is a Store Owner, admin can view the assigned store and its average rating.
- View, search, and sort stores.
- View store ratings submitted by users.

### User
- View available stores.
- Search stores by name or address.
- Submit a rating for a store.
- Update previously submitted rating.
- View overall average rating of each store.
- View own submitted rating.

### Store Owner
- View dashboard with store rating summary.
- View users who rated their store.
- View ratings received from customers.

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt

Database Table design :
<img width="899" height="815" alt="1" src="https://github.com/user-attachments/assets/b43d949c-9929-46b5-ae75-c2f0e1531d0b" />

