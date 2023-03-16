import express from "express";
import { Router } from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = Router();

const configuration = new Configuration({
    apiKey: "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",
});
 
const openai = new OpenAIApi(configuration);

router.route("/").get((req, res) => {
    res.send("Hello from DALL-E");
});

router.route("/").post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await openai.createImage({
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json"
          });
          const image = response.data.data[0].b64_json;
          res.status(200).json({ photo: image });
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
    }
});

export default router;
