import { createRequire } from "module";
import UserData from "../models/UserData.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
globalThis.fetch = fetch;
import { createWorker } from 'tesseract.js';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_GENERATIVE_AI_API_KEY);


const require = createRequire(import.meta.url);
const { ocrSpace } = require('ocr-space-api-wrapper');



function extractNumbersFromString(inputString) {
    const numbersArray = inputString.match(/\d+/g);
    if (numbersArray) {
        const resultString = numbersArray.join("");
        return resultString;
    } else {
        return "No numbers found in the string.";
    }
}

async function parseData(input) {

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const msg = input;

      const inputmess = input;
      async function removeAdhaar(str) {
        // Replace the word "ADHAAR" with an empty string
        var result = str.replace(/ADHAAR/g, '');
        return result;
      }

      async function removebacktics(str) {
        // Replace the word "ADHAAR" with an empty string
        var result = str.replace(/```/g, '');
        return result;
      }

      var outputString =await removeAdhaar(inputmess);
      // console.log(outputString)
      const prompt = "you will be given a string extract the useful details such as (name,dob,gender,phoneNumbers)only from it and convert to a json object and return it remove. remember the typof the value must me object";
      const ans = outputString;
      const result = await model.generateContent([prompt, ans]);
      const response = await result.response;
      const finalrespose = await removebacktics(response.text());
      // const text = response.text();
      // console.log(finalrespose);
      return finalrespose;
}



// Function to check if a value matches a given pattern
const checkPattern = (userData) => {

// Regular expression patterns for each property format
const namePattern = /^[A-Za-z\s]+$/;
const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
const genderPattern = /^(Male|Female|Other)$/i; // Case-insensitive match
const adhaarNumberPattern = /^\d{4}\s\d{4}\s\d{4}$/;

// Function to check if a value matches a given pattern
function isFormatValid(value, pattern) {
    return pattern.test(value);
}

if (
    isFormatValid(userData.name, namePattern) &&
    isFormatValid(userData.dob, dobPattern) &&
    isFormatValid(userData.gender, genderPattern) &&
    isFormatValid(userData.adhaarNumber, adhaarNumberPattern)
) {
    return true;
} else {
    return false;
}

}

export const scanTesseract = async (req, res) =>{
  // console.log(req.body)
  try {
    const url = 'data:image/jpeg;base64,'+req.body.image;
    // imageVerification(url);
    const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(url);
      await worker.terminate();
      if(text===undefined){
        res.status(404).json("Please try again")
      }
      const data =await parseData(text);
      const temp = JSON.parse(data);
      const userData = {
                        name : temp.name ? temp.name : null ,
                        dob: temp.dob ? temp.dob : null,
                        gender :temp.gender ? temp.gender : null,
                        adhaarNumber :temp.phoneNumbers.length!==0 ? temp.phoneNumbers[0] ? temp.phoneNumbers[0] : null : null
                        }
      if(userData.name ===null || userData.dob===null || userData.adhaarNumber===null || userData.gender===null){
        res.status(404).json("Please try again");
      }
      else{
        if(!checkPattern(userData)){
          res.status(404).json("Please try again");
        }
        const newUserData = new UserData(userData);
        await newUserData.save();
        res.status(200).json(userData);
      }
    } catch (error) {
      res.status(404).json("unexpected Error, Please try again")
      console.error(error);
    }
  }


  export const imageVerification = async (imageUrl) => {
    const {spawn} = require('child_process');
    const python = spawn('python', ['controllers/imageVerification.py', imageUrl]);

    python.stdout.on('data', (data) => {
      const result = data.toString();
      console.log('stdout: ' + result);
    });

    python.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
    });

    python.on('close', async (code) => {
        console.log('child process exited with code ' + code.toString());
    });
  }

