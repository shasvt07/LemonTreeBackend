import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
globalThis.fetch = fetch;

const genAI = new GoogleGenerativeAI('AIzaSyDOI4I-arrZ3zkgLi16N1W117iL4x0vOME');


export const maximumMatching = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const arrays = {
        arr1: ["check-in", "self-check-in process", "entry process", "check me in", "check-in-process"],
        arr2: ["check-out", "self-checkout", "self-checkout-process", "exit process", "check me out", "checkout-process"],
        arr3: ["booking", "Walk-In", "book room", "book me a room", "book"],
      };
      const prompt = "find the given string maximum matches to which array of strings and return the name of the array";
      const givenString = "check me in";
  
      const content = [
        { partType: 'Prompt', value: prompt },
        { partType: 'User', value: givenString },
        { partType: 'External', value: arrays },
      ];
  
      const result = await model.generateContent(content);
      const response = await result.response;
      const text = await response.text();
      console.log(response);
      console.log(text);
    } catch (error) {
      console.log(error.message);
      // res.status(400).json({message:error.message});
    }
  };

