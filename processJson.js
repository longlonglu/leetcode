const fs = require('fs');

// File paths
const inputFile = './test.json';
const outputFile = './output.json';

// Read JSON array from file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // Parse JSON array
    const jsonArray = JSON.parse(data);
    console.log(`Read ${jsonArray.length} items from ${inputFile}`);

    // Extract only specific attributes from each item
    const processedArray = jsonArray.map(item => ({
      t: item.title,
      n: item.questionFrontendId,
      d: item.difficulty,
      g: item.topicTags ? item.topicTags.map(tag => tag.name) : [],
    }));

    // Write to output file
    fs.writeFile(outputFile, JSON.stringify(processedArray, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log(`Successfully wrote ${processedArray.length} items to ${outputFile}`);
    });

  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
