const fetch = require('node-fetch');
const fs = require('fs');

let currentItem = 0;
let titles = [];
let interval = null;

requestTrainingData();

async function requestTrainingData() {
  const maxitemResponse = await fetch('https://hacker-news.firebaseio.com/v0/maxitem.json', { method: 'get' });
  currentItem = await maxitemResponse.json();

  interval = setInterval(requestTitles, 1 * 1000);
  setTimeout(stopRequestTitles, 10 * 60 * 60 * 1000);
}

async function requestTitles() {
  let itemResponses = [];
  let itemCount = 100;

  for (currentItem; currentItem > 0; currentItem--) {
    if (itemCount === 0) {
      break;
    }

    const itemResponse = fetch(`https://hacker-news.firebaseio.com/v0/item/${currentItem}.json?`, { method: 'get' });
    itemResponses.push(itemResponse);
    itemCount--;
  }

  itemResponses = await Promise.all(itemResponses);

  for (let itemResponsesIndex = 0; itemResponsesIndex < itemResponses.length; itemResponsesIndex++) {
    itemResponses[itemResponsesIndex] = itemResponses[itemResponsesIndex].json();
  }

  itemResponses = await Promise.all(itemResponses);

  for (const itemResponse of itemResponses) {
    if (itemResponse === null || !itemResponse.hasOwnProperty('type')
      || itemResponse.type !== 'story') {
      continue;
    }

    if (typeof itemResponse.title === 'string') {
      titles.push(itemResponse.title);
    }
  }

  console.log(`${titles.length} training data is requested.`);
}

function stopRequestTitles() {
  clearInterval(interval);

  fs.writeFile('Training Data.json', JSON.stringify(titles, null, 2), (error) => {
    if (error) throw error;

    console.log('Training Data.json is saved.');
  });

  console.log(currentItem);
}
