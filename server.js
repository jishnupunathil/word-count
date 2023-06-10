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


let wordCounts = [];



app.get('/api/wordcount', (req, res) => {
  const { url } = req.query;
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

app.get('/api/media', (req, res) => {
  const { url } = req.query;
  axios.get(url)
    .then(response => {
      const htmlContent = response.data;
      const $ = cheerio.load(htmlContent);
      const mediaElements = $('img, video');
      const mediaDetails = mediaElements.map((index, element) => {
        const mediaType = element.name;
        const src = $(element).attr('src');
        const alt = $(element).attr('alt');
        const dimensions = {
          width: $(element).attr('width'),
          height: $(element).attr('height')
        };
        return {
          mediaType,
          src,
          alt,
          dimensions
        };
      }).get();
      res.json(mediaDetails);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving media details' });
    });
});

app.get('/api/history', (req, res) => {
  res.json(wordCounts);
});

app.post('/api/wordcount', (req, res) => {
  const { url, wordCount } = req.body;
  const wordCountEntry = { url, count: wordCount };
  wordCounts.push(wordCountEntry);
  res.status(201).json({ message: 'Word count saved successfully' });
});

app.delete('/api/wordcount', (req, res) => {
  const { url, count } = req.body;
  wordCounts = wordCounts.filter(entry => entry.url !== url || entry.count !== parseInt(count));
  res.status(200).json({ message: 'Word count removed successfully' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
