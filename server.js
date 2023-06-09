const express = require("express");
const app = express();
const path = require('path');

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
  // Example using axios and cheerio:
  axios.get(url)
    .then(response => {
      const htmlContent = response.data;
      const $ = cheerio.load(htmlContent);
      const text = $('body').text();
      const wordCount = text.split(' ').length;
      res.json({ wordCount });
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving word count' });
    });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
