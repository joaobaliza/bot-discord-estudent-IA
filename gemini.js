const { GoogleGenerativeAI } = require('@google/generative-ai');

const geminiClient = new GoogleGenerativeAI({
    apiKey: process.env.API_KEY || require('./config.json').API_KEY
});

module.exports = geminiClient;