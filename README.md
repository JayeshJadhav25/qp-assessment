# Clone the repository

- git clone https://github.com/JayeshJadhav25/qp-assessment
- cd qp-assessment


# Configure the environment variables

PORT=3000
DB_HOST=mysql-db
DB_USER=root
DB_PASSWORD=ac3r
DB_NAME=groceries
DB_PORT=3306

# Build and run the Docker containers
- docker-compose up --build


# Verify the setup
Test the /api/auth/register endpoint using Postman or curl.
