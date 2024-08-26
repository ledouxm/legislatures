const fs = require('fs');

// Read the input file
const rawData = fs.readFileSync('legislatures-input.json', 'utf8');
const data = JSON.parse(rawData);

// Transform the data
function transformData(data) {
    const transformed = [];

    // Iterate over the republics objects
    for (const [republicName, republicDatas] of Object.entries(data)) {
        const result = {
            "name": republicName,
            "legislatures": []
        };

        // Iterate over the legislatures array
        republicDatas.legislatures.forEach(legislature => {
            // Push the legislature directly without an inner loop
            const legislatureResult = {
                "legislature": legislature.legislature, // Use the legislature number directly
                "total_deputes": legislature.total_deputes,
                "duration": legislature.duration,
                "parties": []
            };

            // Iterate over the parties objects
            for (const [partyName, partyDatas] of Object.entries(legislature.parties)) {
                legislatureResult.parties.push({
                    "name": partyName,
                    "deputes": partyDatas.deputes,
                    "coalition": partyDatas.coalition
                });
            }

            result.legislatures.push(legislatureResult);
        });
    
        // Push the result to the transformed array
        transformed.push(result);
    }

    // Return the transformed array
    return transformed;
}

// Save the transformed data to a new file
const transformedData = transformData(data);
fs.writeFileSync('legislatures-output.json', JSON.stringify({ "republics": transformedData }, null, 2), 'utf8');
console.log('Data has been transformed and saved to legislatures-output.json');
