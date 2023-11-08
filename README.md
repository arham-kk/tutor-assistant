# OpenAI Math Tutor Assistant

This Node.js application utilizes the OpenAI Assistants API to create a Math Tutor assistant. It allows you to interact with the assistant by asking math-related questions and getting answers.

## Prerequisites

Before running the code, ensure you have the following prerequisites installed:

- Node.js
- OpenAI npm (4.16.1 or later)
- Readline npm
- dotenv npm
- An OpenAI API key

You may need to make sure that your Node.js version is compatible with the OpenAI npm to avoid dependency issues.

## Installation

1. Clone or download this repository to your local machine.

2. Navigate to the project folder in your terminal.

3. Create a `.env` file in the project directory and add your OpenAI API key to it:

   ```
   OPENAI_API_KEY="REPLACE WITH YOUR OPENAI API KEY HERE"
   ```

4. Install the required dependencies by running the following commands:

   ```
   yarn add openai
   yarn add readline
   yarn add dotenv
   ```

## Usage

To run the Math Tutor Assistant, execute the following command in your terminal:

```
node math-tutor.js
```

The chatbot will start and guide you through the process of asking math questions.

## Configuration

The code is set up to use the GPT-4 model and the "Math Tutor" assistant by default. You can customize the assistant's behavior by modifying the code. You can change the assistant's name, instructions, and the OpenAI model used in the `main` function.

```javascript
const assistant = await openai.beta.assistants.create({
  name: "Math Tutor",
  instructions:
    "You are a math tutor. Write and run code to answer math questions.",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4-1106-preview",
});
```

## License

This project is licensed under the MIT License.