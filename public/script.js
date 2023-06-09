// Function to calculate word count
function getWordCount(url, callback) {
  fetch(`/api/wordcount?url=${encodeURIComponent(url)}`)
    .then(response => response.json())
    .then(data => {
      callback(data.wordCount);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to send the word count to the server
function saveWordCount(url, wordCount) {
  const data = { url, wordCount };

  fetch('/api/wordcount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        console.log('Word count saved successfully');
        // Display the updated word count history
        getWordCountHistory();
      } else {
        console.error('Error saving word count');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to remove word count entry
function removeWordCount(url, count) {
  fetch('/api/wordcount', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, count })
  })
    .then(response => {
      if (response.ok) {
        console.log('Word count removed successfully');
        // Refresh the word count history
        getWordCountHistory();
      } else {
        console.error('Error removing word count');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to display the word count history on the webpage
function displayWordCountHistory(wordCounts) {
  const historyBody = document.getElementById('historyBody');
  historyBody.innerHTML = '';

  wordCounts.forEach(wordCount => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${wordCount.url}</td>
      <td>${wordCount.count}</td>
      <td>
        <button class="removeButton">Remove</button>
      </td>
    `;
    historyBody.appendChild(row);
  });
}

// Function to fetch the word count history from the server
function getWordCountHistory() {
  fetch('/api/history')
    .then(response => response.json())
    .then(data => {
      displayWordCountHistory(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to handle the button click event
function handleButtonClick() {
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value;

  if (url.trim() === '') {
    console.log('URL cannot be empty');
    return;
  }

  getWordCount(url, wordCount => {
    saveWordCount(url, wordCount);

    // Display the word count in the <h2> tag
    const wordCountElement = document.getElementById('wordCount');
    wordCountElement.textContent = wordCount;
  });
}

// Function to initialize the webpage
function initialize() {
  const button = document.getElementById('getWordCountButton');
  button.addEventListener('click', handleButtonClick);

  getWordCountHistory();

  // Event listener for click events on the table
  document.getElementById('historyTable').addEventListener('click', function (event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('removeButton')) {
      const tableRow = clickedElement.closest('tr');
      const url = tableRow.cells[0].textContent;
      const count = tableRow.cells[1].textContent;
      removeWordCount(url, count);
    }
  });
}

// Call the initialize function when the webpage loads
window.addEventListener('load', initialize);
