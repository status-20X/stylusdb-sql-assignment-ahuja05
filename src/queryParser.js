function parseQuery(query) {
    const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
    const match = query.match(selectRegex);

    
    if (match) {
        const [, fields, table, whereClause] = match;
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim(),
            whereClause: whereClause ? whereClause.trim() : null
        };
    } else {
        throw new Error('Invalid query format');
    }
}

function parseWhereClause(whereString) {
    const conditionRegex = /(.*?)(=|!=|>|<|>=|<=)(.*)/;
    try{
    return whereString.split(/ AND | OR /i).map(conditionString => {
        const match = conditionString.match(conditionRegex);
        if (match) {
            const [, field, operator, value] = match;
            return { field: field.trim(), operator, value: value.trim() };
        }
        throw new Error('Invalid WHERE clause format');
    });
}catch (error) {
    throw new Error(`Error parsing WHERE clause: ${error.message}`);
}
}

module.exports = parseQuery;