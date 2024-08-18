Leetbud is a full-stack MERN application designed to assist programmers in preparing for coding challenges on LeetCode. The application leverages modern web technologies including React, Node.js, Express, and MongoDB, and features secure authentication with Google OAuth 2.0, RESTful API integration, and automated tools for enhancing coding practice.

## Table of Contents
- [What's New](#whats-new)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## What's New
- Latest Release: Version 1.0.3
  - Improved session management with Passport.js.
  - Removed Selenium retrieve functionality

## Features
- **Secure Authentication**: Utilizes Google OAuth 2.0 for secure and reliable user authentication.
- **Responsive User Interface**: Built with Tailwind CSS and React for a dynamic, responsive design.
- **RESTful APIs**: Developed using Node.js, Express, and MongoDB, with Mongoose for efficient database operations.
- **Automated Content Generation**: Integrates OpenAI's GPT-3.5 Turbo to automatically generate programming notes.
- **Efficient Data Retrieval**: Employs Selenium WebDriver for scraping LeetCode questions.
- **Testing and Deployment**: Includes backend testing with Jest, uses Docker for containerization, and is deployed on Amazon EC2 with nginx for load balancing.

## Installation

### Prerequisites
- Docker
- Node.js
- npm or yarn

### Local Setup
1. Clone the repository:
```
git clone https://github.com/hrushipandit/Leetbuddy
```
Navigate to the project directory:
```
cd leetbud
```
Run the application using Docker:
```
docker-compose up
```
## Usage:

Development:
Access the frontend at https://localhost:3000
Access the backend at https://localhost:5000

Production:
Visit the live site at : https://www.leetbud.com


## Contributing

Interested in contributing?
- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Commit your changes (git commit -am 'Add some feature').
- Push to the branch (git push origin feature-branch).
- Create a new Pull Request.







