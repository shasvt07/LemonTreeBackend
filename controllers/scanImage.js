import { createRequire } from "module";
import UserData from "../models/UserData.js";
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

function parseData(input) {
    const data = {};
    const nameMatch = input.match(/\n(.+?)\nDOB:/);
    const dobMatch = input.match(/DOB: (.+?)\r\n/);
    const genderMatch = input.match(/\/ (\w+?)\r\n/);
    const additionalInfoMatch = input.match(/\/(.+)/s); // Use 's' flag to make dot match newline

    data.name = nameMatch ? nameMatch[1] : null;
    data.dob = dobMatch ? dobMatch[1] : null;
    data.gender = genderMatch ? genderMatch[1] : null;
    const temp = additionalInfoMatch ? extractNumbersFromString(additionalInfoMatch[1]) : null;
    data.adhaarNumber = temp?.length >=12 ? temp.substring(temp.length - 12) : null;

    return data;
}



export const scanImage = async (req, res) =>{
  
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    const url = 'data:image/png;base64,'+req.body.imagePath;
    const res1 = await ocrSpace(url, { apiKey: 'K89692836588957'});
    // const res1 = ReadText(url);
    console.log(res1);
    // Using your personal API key + local file
    // const res2 = await ocrSpace('/path/to/file.pdf', { apiKey: '<API_KEY_HERE>' });
    // Using your personal API key + base64 image + custom language
    // const res3 = await ocrSpace(req.query.imagePath, { apiKey: 'K89692836588957'});
    const data = res1.ParsedResults[0].ParsedText;
    console.log(data);
    const temp = parseData(data);
    console.log(temp);
    // const newUserData = new UserData(temp);
    // await newUserData.save();
    // res.status(200).json(newUserData);

  } catch (error) {
    console.error(error);
  }
}


