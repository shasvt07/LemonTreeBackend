import { OpenAI} from 'openai';


const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
})


export const AIAgent = async () => {
  const arrays = {
    arr1: ["check in", "self check in process", "entry process", "check me in", "check in process"],
    arr2: ["check out", "self checkout", "self checkout process", "exit process", "check me out", "checkout process"],
    arr3: ["booking", "Walk-In", "book room", "book me a room", "book"]
  };

  const prompt = `Find out whether the given string mataches to which of the follwoing arrays and return the names of array only. Else give not found : 
  arr1: ["check in", "self check in process", "entry process", "check me in", "check in process"],
  arr3: ["check out", "self checkout", "self checkout process", "exit process", "check me out", "checkout process"],
  arr2: ["booking", "Walk-In", "book room", "book me a room", "book"]`
  
  // Given input string
  const userInput = "Checkin book me a room, check out";
  
  // Concatenate array values into a single string for GPT input
  const gptInput = Object.values(arrays).flat().join(' ');
  
  // Use GPT to generate a response
  const gptResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }, { role: 'user', content: userInput}],
    max_tokens: 50,
    temperature: 0.7,
  });

  const gptOutput = gptResponse.choices[0].message;
  console.log(gptOutput);

// Check which array the GPT response is most likely related to
  // const matchingArray = Object.keys(arrays).find(arrayName => gptOutput.includes(arrayName));

  // console.log(`The input string matches with ${matchingArray} array with a 50% probability.`);
}

// AiAgent();


// export const runPrompt = async (prompt) => {

//     const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'system', content: 'You are a helpful assistant.' }, ...prompt],
//       });
  
//       console.log('Generated Response:', response.choices[0].message);
  
//     console.log(response);
// }

// runPrompt(conversation);


