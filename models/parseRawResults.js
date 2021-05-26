
module.exports = (rawResults, keys) => {
    if(rawResults.length === 0) {
        return [];
    }
    const results = rawResults.map(result => {
        const row = result.row.slice(1, -1).split(',');
        let keyValuePair = {};
        row.forEach((column, index) => {
            const key = keys[index];
            keyValuePair[key] = column;
        });
        return keyValuePair;
    });
    return results;
};
