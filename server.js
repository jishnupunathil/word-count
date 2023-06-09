const express = require("express");
const app = express();
const path = require('path');
const axios=require('axios')
const cheerio=require('cheerio')

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
  })

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


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
