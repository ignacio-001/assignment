const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { parse } = require('json2csv');

const app = express();
const PORT = 3000;

// API Endpoints
const API_1 = 'https://jsonplaceholder.typicode.com/users';
const API_2 = 'https://jsonplaceholder.typicode.com/posts';
const API_3 = 'https://jsonplaceholder.typicode.com/comments';

app.get('/generate-csv', async (req, res) => {
  try {
    // Fetching data from the APIs with error handling and awaiting on them in the concurrent fashion
    const [usersRes, postsRes, commentsRes] = await Promise.allSettled([axios.get(API_1), axios.get(API_2), axios.get(API_3)]);

    // Check failure of the APIs
    if (usersRes.status !== 'fulfilled') throw Error(`The Users could not be fetched: ${usersRes.reason}`);
    if (postsRes.status !== 'fulfilled') throw Error(`The Posts could not be fetched: ${postsRes.reason}`);
    if (commentsRes.status !== 'fulfilled') throw Error(`The Comments could not be fetched: ${commentsRes.reason}`);

    const users = usersRes.value.data;
    const posts = postsRes.value.data;
    const comments = commentsRes.value.data;

    // Map data by userId
    const dataMap = {};

    // Store user names by id
    users.forEach((user) => {
      dataMap[user.id] = { name: user.name, title: '', body: '' };
    });

    // Map post titles by userId
    posts.forEach((post) => {
      if (dataMap[post.userId]) {
        dataMap[post.userId].title = post.title;
      }
    });

    // Map comment bodies by postId -> userId
    comments.forEach((comment) => {
      const post = posts.find((p) => p.id === comment.postId);
      if (post && dataMap[post.userId]) {
        dataMap[post.userId].body = comment.body;
      }
    });

    // Convert to array form
    const csvData = Object.values(dataMap);

    // Convert to CSV
    const csv = parse(csvData, { fields: ['name', 'title', 'body'] });

    // Specify file path
    const filePath = path.join(__dirname, 'output.csv');

    // Write to file with error handling
    fs.writeFile(filePath, csv, (err) => {
      if (err) {
        console.error('Error writing CSV file:', err);
        return res.status(500).json({ error: 'Failed to write CSV file' });
      }
      res.json({ filePath });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to generate CSV', details: error.message });
  }
});

// 404 Hanler for Unknown Routes
app.use((req, res) => {
  res.status(404).json({ error: 'Invalid endpoint. Only /generate-csv is available.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});