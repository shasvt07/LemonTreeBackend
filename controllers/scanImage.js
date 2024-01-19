import { createRequire } from "module";
import UserData from "../models/UserData.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
globalThis.fetch = fetch;
import { createWorker } from 'tesseract.js';


const genAI = new GoogleGenerativeAI('AIzaSyDOI4I-arrZ3zkgLi16N1W117iL4x0vOME');


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
      console.log(finalrespose);
      return finalrespose;
}

export const scanTesseract = async (req, res) =>{
  console.log(req.body)

  try {
    const url = 'data:image/jpeg;base64,'+req.body.image;
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
        res.status(404).json("Please try again")
      }
      else{
        const newUserData = new UserData(userData);
        await newUserData.save();
        res.status(200).json(userData);
      }
    } catch (error) {
      res.status(404).json("unexpected Error, Please try again")
      console.error(error);
    }
  }


export const scanImage = async (req, res) =>{
  
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    const url = 'data:image/jpeg;base64,'+req.body.image; 
    const res1 = await ocrSpace(url, { apiKey: 'K81019325588957'});
    // const res1 = ReadText(url);
    console.log(res1);
    // Using your personal API key + local file
    // const res2 = await ocrSpace('/path/to/file.pdf', { apiKey: '<API_KEY_HERE>' });
    // Using your personal API key + base64 image + custom language
    // const res3 = await ocrSpace(req.query.imagePath, { apiKey: 'K89692836588957'});

    const data = res1.ParsedResults[0]?.ParsedText;
    console.log(data);

    if(data===undefined){
      res.status(404).json("Please try again")
    }
    const dataGot =await parseData(data);
    const temp = JSON.parse(dataGot);
    // console.log(temp)
    
    const userData = {
                      name : temp.name ? temp.name : null ,
                      dob: temp.dob ? temp.dob : null,
                      gender :temp.gender ? temp.gender : null,
                      adhaarNumber :temp.phoneNumbers.length!==0 ? temp.phoneNumbers[0] ? temp.phoneNumbers[0] : null : null
                      }
                      // console.log(temp.phoneNumbers[0]);
    console.log(userData)
    if(userData.name ===null || userData.dob===null || userData.adhaarNumber===null || userData.gender===null){
      res.status(404).json("Please try again")
    }
    else{
      const newUserData = new UserData(userData);
      await newUserData.save();
      res.status(200).json(userData);
    }
    // console.log(temp);
  } catch (error) {
    res.status(404).json("unexpected Error, Please try again")
    console.error(error);
  }
}


