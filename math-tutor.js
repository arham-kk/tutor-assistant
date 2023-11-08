require("dotenv").config();
const OpenAI = require("openai");

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
  process.exit(1);
}

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create an OpenAI connection
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askQuestion(question) {
  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });

    readline.on('error', reject);
  });
}

async function waitForRunCompletion(threadId, runId, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (runStatus.status === "completed") {
      return runStatus;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Run did not complete within the specified maxRetries");
}

async function main() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions: "You are a math tutor. Write and run code to answer math questions.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });

    console.log("\nHello, I'm your personal math tutor. Ask some complicated questions.\n");

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Use keepAsking for keep asking questions
    let keepAsking = true;
    while (keepAsking) {
      const userQuestion = await askQuestion("\nWhat is your question? ");

      // Pass in the user question into the existing thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userQuestion,
      });

      // Use runs to wait for the assistant response and then retrieve it
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

      await waitForRunCompletion(thread.id, run.id);

      const messages = await openai.beta.threads.messages.list(thread.id);

      const lastMessageForRun = messages.data
        .filter(
          (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

      if (lastMessageForRun) {
        console.log(`${lastMessageForRun.content[0].text.value} \n`);
      }

      const continueAsking = await askQuestion(
        "Do you want to ask another question? (y/n) "
      );
      keepAsking = continueAsking.toLowerCase() === "y";

      if (!keepAsking) {
        console.log("Ok, I hope you learned something!\n");
      }
    }

    readline.close();
  } catch (error) {
    console.error(error);
  }
}

main();