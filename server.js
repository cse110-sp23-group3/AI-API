import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import 'dotenv/config';

// create app
const app = express();
app.use(express.json());

// Set api key (DO NOT ABUSE!)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/api/ask-chat', async (req, res) => {
  try {
    // get prompt from request body
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required'
      });
    }

    // generate response
    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    // Access and return the actual response
    const parsedResponse = gptResponse.data.choices[0].message.content.trim();
    res.json({
      chatResponse: parsedResponse
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'An error occurred while generating text',
      details: error.message
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
