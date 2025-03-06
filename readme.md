# Express.js CSV Generator

This Express.js application fetches data from three different APIs, extracts specific fields, and generates a CSV file. The generated file contains `name`, `title`, and `body` fields mapped by `id`.

## Features
- Fetches data from three APIs asynchronously:
  - Users: `https://jsonplaceholder.typicode.com/users`
  - Posts: `https://jsonplaceholder.typicode.com/posts`
  - Comments: `https://jsonplaceholder.typicode.com/comments`
- Extracts `name`, `title`, and `body` from the responses.
- Maps data based on user `id` and writes it to a CSV file.
- Returns the file path of the generated CSV.
- Proper error handling for API failures and file-writing issues.
- Returns a `404 error` for invalid routes.

## Setup, Installation & Running the Project
Run the following commands to set up and start the server:
```sh
git clone https://github.com/ignacio-001/assignment
cd assignment
npm install
node expressCsvGenerator

## For Testing
npm test


