const { randomUUID } = require('crypto');

const newId = () => randomUUID().replace(/-/g, '').slice(0, 12);

const parseJson = (value) => (typeof value === 'string' ? JSON.parse(value) : value);

module.exports = { newId, parseJson };
