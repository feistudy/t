const natural = require('natural');

const category = {
  AI: /\b(ai|artificial intelligence|alphago|deep learning|deepmind|machine learning|neural network|scikit-learn|tensorflow)\b/i,
  BigData: /\b(big data|data mining|data scientist|hadoop|mapreduce|spark|statistics)\b/i,
  Business: /\b(business|company|fund|hiring|invest|ipo|marketing|startup)\b/i,
  Cloud: /\b(cloud|aws|azure|google cloud platform|serverless)\b/i,
  Database: /\b(database|cassandra|mongodb|mysql|nosql|postgresql|redis|sql)\b/i,
  Hardware: /\b(hardware|cpu|gpu|hard disk|memory|ram)\b/i,
  Mobile: /\b(mobile|android|apps|ios|iphone|tablet)\b/i,
  Networking: /\b(networking|ftp|http|ip|packet|protocol|socket|tcp|udp|wireless)\b/i,
  OS: /\b(os|operating system|mac|linux|unix|virtual machine|windows)\b/i,
  Programming: /\b(programming|algorithm|c|code|c#|data structure|design pattern|functional|go|java|javascript|object oriented|php|python|r|swift)\b/i,
  Security: /\b(security|bug|ddos|decrypt|encrypt|firewall|hacker|trojan|virus)\b/i,
  SoftwareEngineering: /\b(software engineering|agile|devops|project management|scrum|sdlc|tdd)\b/i,
};

let trainingData = require('./Training Data.json');

let classifier = new natural.BayesClassifier();

for (let title of trainingData) {
  title = title.replace('Show HN: ', '');
  title = title.replace('Ask HN: ', '');

  let isIncludes = false;

  Object.keys(category).forEach((key) => {
    if (category[key].test(title)) {
      if (!isIncludes) {
        classifier.addDocument(title, key);
        console.log(`[${key}] ${title}`);
      }

      isIncludes = true;
    }
  });

  if (!isIncludes) {
    classifier.addDocument(title, 'Other');
    console.log(`[Other] ${title}`);
  }
}

classifier.train();

classifier.save('Classifier.json', (error, classifier) => {
  console.log('Classifier.json is saved.');
});
