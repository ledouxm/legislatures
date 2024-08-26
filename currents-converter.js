const fs = require('fs');

// Read the input file
const rawData = fs.readFileSync('currents-input.json', 'utf8');
const data = JSON.parse(rawData);

// Transform the data
function transformData(data) {
    const transformed = [];

    // Iterate over the currents array
    const currents = data.currents;
    currents.forEach(current => {
        // Iterate over the current object
        for (const [currentName, currentDatas] of Object.entries(current)) {
            const result = {
                "name": currentName,
                "color": currentDatas.color,
                "parties": []
            };

            // Iterate over the parties array
            currentDatas.parties.forEach(party => {
                // Iterate over the party object
                for (const [partyName, partyDatas] of Object.entries(party)) {
                    result.parties.push({
                        "name": partyName,
                        "full_name": partyDatas.full_name
                    });
                }
            });
            // Push the result to the transformed array
            transformed.push(result);
        }
    });
    // Return the transformed array
    return transformed;
}

// Save the transformed data to a new file
const transformedData = transformData(data);
fs.writeFileSync('currents-output.json', JSON.stringify({ "currents": transformedData }, null, 2), 'utf8');
console.log('Data has been transformed and saved to currents-output.json');
