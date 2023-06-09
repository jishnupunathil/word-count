const express = require("express");
const app = express();
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Temporary storage for word counts and domains
let wordCounts = [];
let domains = [];

// Retrieve Word Count
app.get('/api/wordcount', (req, res) => {
  const { url } = req.query;

  // Logic to fetch website content and calculate word count
  axios.get(url)
    .then(response => {
      const htmlContent = response.data;
      const $ = cheerio.load(htmlContent);
      const text = $('body').text();
      const wordCount = text.split(' ').length;

      // Return the word count as a JSON response
      res.json({ wordCount });
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving word count' });
    });
});

app.get('/api/history', (req, res) => {
  res.json(wordCounts);
});

app.post('/api/wordcount', (req, res) => {
  const { url, wordCount } = req.body;

  // Save the word count to the server
  const wordCountEntry = { url, count: wordCount };
  wordCounts.push(wordCountEntry);

  // Send a success response
  res.status(201).json({ message: 'Word count saved successfully' });
});

app.delete('/api/wordcount', (req, res) => {
  const { url, count } = req.body;

  // Remove the word count entry from the server
  wordCounts = wordCounts.filter(entry => entry.url !== url || entry.count !== parseInt(count));

  // Send a success response
  res.status(200).json({ message: 'Word count removed successfully' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
