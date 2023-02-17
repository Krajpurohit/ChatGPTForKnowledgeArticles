import * as openai from "openai";
import * as React from "react";
import { IInputs } from "../../generated/ManifestTypes";

export class ApiService {
  prompt: string;
  setResponse: React.Dispatch<React.SetStateAction<string>>;
  setIsInProgress: React.Dispatch<React.SetStateAction<boolean>>;
  pcfContext: ComponentFramework.Context<IInputs>;
  constructor(
    propmt: string,
    setResponse: React.Dispatch<React.SetStateAction<string>>,
    setIsInProgress: React.Dispatch<React.SetStateAction<boolean>>,
    pcfContext: ComponentFramework.Context<IInputs>
  ) {
    this.prompt = propmt;
    this.setResponse = setResponse;
    this.setIsInProgress = setIsInProgress;
    this.pcfContext = pcfContext;
  }
  async getResponseFromChatGPT() {
    this.setIsInProgress(true);
    const config = new openai.Configuration({
      apiKey: this.pcfContext.parameters.apiKey.raw || "",
    });
    const openAI = new openai.OpenAIApi(config);

    const completion = await openAI.createCompletion({
      model: "text-davinci-003",
      prompt: this.prompt,
      temperature: 0.9,
      max_tokens: 255,
      top_p: 1,
    });
    let response = completion.data.choices[0].text?.trimStart();
    this.setResponse(response || "");

    this.setIsInProgress(false);
  }
}
