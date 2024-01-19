import { OpenAI} from 'openai';


const openai = new OpenAI({
    apiKey:'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'
})

const textSample = `Q'.Govemment of
Sanjna varma Singh
/ DOB : 11/04/1995
Female
9426 6359 3552
-A-tr
`
const conversation = [
    { role: 'user', content: 'Tell me a joke.' },
    { role: 'assistant', content: 'Why did the chicken cross the road?'},
    { role: 'user', content: 'I don’t know. Why did the chicken cross the road?'},
  ];

export const runPrompt = async (prompt) => {

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'You are a helpful assistant.' }, ...prompt],
      });
  
      console.log('Generated Response:', response.choices[0].message);
  
    console.log(response);
}

// runPrompt(conversation);


