import { spawn } from "child_process";
import path from "path";

interface Props {
  scriptPath: string;
  scriptInput: any;
}

interface Return {
  message: string;
  data: any | null;
}

const runPythonScript = async ({ scriptPath, scriptInput }: Props): Promise<Return> => {
  return new Promise((resolve) => {
    const pythonPath = path.resolve(__dirname, "../../.venv/bin/python");
    const py = spawn(pythonPath, [scriptPath]);

    py.stdin.write(JSON.stringify(scriptInput));
    py.stdin.end();

    let output = "";
    let errOutput = "";

    py.stdout.on("data", (chunk) => (output += chunk.toString()));
    py.stderr.on("data", (chunk) => (errOutput += chunk.toString()));

    py.on("error", (err) => {
      console.error("Python spawn error:", err);
      resolve({ message: `Failed to spawn Python process: ${err.message}`, data: null });
    });

    py.on("close", (code) => {
      if (code !== 0) {
        return resolve({ message: `Python script failed: ${errOutput.trim()}`, data: null });
      }

      try {
        const parsedOutput = JSON.parse(output);
        if (parsedOutput.error) {
          return resolve({ message: `Python returned error: ${parsedOutput.error}`, data: null });
        }

        console.log('message, data', parsedOutput);
        return resolve({ message: "Python script succeeded", data: parsedOutput });
      } catch (err) {
        console.error("Failed to parse Python output:", err, output);
        return resolve({ message: "Failed to parse Python output", data: null });
      }
    });
  });
};

export default runPythonScript;
