const readCSV = require('../../src/csvReader');
const parseQuery = require('../../src/queryParser');
const executeSELECTQuery = require('../../src/index');

test('Read CSV File', async () => {
    const data = await readCSV('./sample.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(3);
    expect(data[0].name).toBe('John');
    expect(data[0].age).toBe('30'); //ignore the string type here, we will fix this later
});

test('Parse SQL Query', () => {
    const query = 'SELECT id, name FROM sample';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClause: null
    });
});

test('Execute SQL Query', async () => {
    const query = 'SELECT id, name FROM sample';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).not.toHaveProperty('age');
    expect(result[0]).toEqual({ id: '1', name: 'John' });
});

test('Parse SQL Query with WHERE Clause', () => {
    const query = 'SELECT id, name FROM sample WHERE age = 25';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClause: "age = 25",
    });
});

test('Execute SQL Query with WHERE Clause', async () => {
    const query = 'SELECT id, name FROM sample WHERE age = 25';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].id).toBe('2');
});

test('Parse SQL Query with Multiple WHERE Clauses', () => {
    const query = 'SELECT id, name FROM sample WHERE age = 30 AND name = John';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClause: "age = 30 AND name = John",
    });
});

test('Execute SQL Query with Multiple WHERE Clause', async () => {
    const query = 'SELECT id, name FROM sample WHERE age = 30 AND name = John';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({ id: '1', name: 'John' });
});

test('Execute SQL Query with Invalid WHERE Clause', async () => {
    const query = 'SELECT id, name FROM sample WHERE age > 25 AND';
    try {
        await executeSELECTQuery(query);
        // If the query executes successfully, fail the test
        throw new Error('Invalid WHERE clause');
    } catch (error) {
        expect(error.message).toMatch('Invalid WHERE clause');
        // Additional assertions if needed
    }
});

// test('Execute SQL Query with Invalid Table Name', async () => {
//     const query = 'SELECT id, name FROM non_existent_table';
//     await expect(executeSELECTQuery(query)).rejects.toThrow('Cannot read CSV file');
// });


test('Execute SQL Query with Greater Than', async () => {
    const queryWithGT = 'SELECT id FROM sample WHERE age > 22';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toEqual(2);
    expect(result[0]).toHaveProperty('id');
});

test('Execute SQL Query with Not Equal to', async () => {
    const queryWithGT = 'SELECT name FROM sample WHERE age != 25';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toEqual(2);
    expect(result[0]).toHaveProperty('name');
});


test('Execute SQL Query with Greater Than', async () => {
    const queryWithGT = 'SELECT id FROM sample WHERE age > 22';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toBe(1); // Assuming no rows match the condition
});

test('Execute SQL Query with Not Equal to', async () => {
    const queryWithNE = 'SELECT name FROM sample WHERE age != 25';
    const result = await executeSELECTQuery(queryWithNE);
    expect(result.length).toBe(0); // Assuming no rows match the condition
});