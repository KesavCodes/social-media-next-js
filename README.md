# Full-Stack Social Media Application

A comprehensive full-stack social media application built using the latest version of Next.js, TypeScript, Tailwind CSS, and Prisma ORM with MySQL.

## Table of Contents

- Installation
- Usage
- Features
- Contributing
- License
- Contact

## Installation

To install and set up the project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/KesavCodes/social-media-next-js.git
    cd social-media-next-js
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Set up environment variables**:
    - Create a `.env` file in the `root` directory and add the necessary environment variables as per the project's requirements.

## Usage

To start the project, follow these steps:

1. **Start the server**:
    ```bash
    cd social-media-next-js
    npm run dev
    ```

## Features

- **Home Page**:
  - Profile card, menu, and advertisement components on the left.
  - Following requests, upcoming birthdays, and advertisement components on the right.
  - Post Feed with posts from friends, like/unlike functionality, and comments.
  - User stories available for 24 hours, with options to add new stories and posts.

- **Post Management**:
  - Write descriptions and upload images for new posts.
  - Can delete posts if you are the owner.

- **User Profile**:
  - View user details and information.
  - Follow/unfollow users, send follow requests, and accept/reject requests.
  - Block users and manage blocked profiles.

- **Profile Management**:
  - Can update user information.
  - Change account information.
  - Upload images using a drag-and-drop widget or choose from a provider.
  - View and manage posts and saved posts.

- **Backend**:
  - Custom API built from scratch.
  - Prisma ORM for database operations with MySQL.
  - Used Cleark Auth for user authentication and authorization.

- **React and Next.js Features**:
  - Server actions to handle form submissions.
  - `useActionState` hook update state based on the result of a form action.
  - Optimistic UI updates using the `useOptimistic` hook.

- **Styling**:
  - Tailwind CSS for responsive and modern styling.

