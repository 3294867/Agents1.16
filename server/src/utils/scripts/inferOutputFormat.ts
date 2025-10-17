import { spawn } from "child_process";
import path from "path";
import constants from '../../constants';

interface Props {
  userInput: any;
}

interface Return {
  message: string;
  data: string | null;
}

const inferOutputFormat = async ({ userInput }: Props): Promise<Return> => {
  return new Promise((resolve) => {
    const pythonPath = path.resolve(__dirname, "../../../.venv/bin/python");
    const scriptPath = path.resolve(__dirname, "../../scripts/infer_output_format.py");
    const py = spawn(pythonPath, [scriptPath]);

    py.stdin.write(JSON.stringify(userInput));
    py.stdin.end();

    let output = "";
    let errOutput = "";

    py.stdout.on("data", (data) => (output += data.toString()));
    py.stderr.on("data", (data) => (errOutput += data.toString()));

    py.on("error", (err) => {
      console.error("Python spawn error:", err);
      resolve({ message: `Failed to spawn Python process: ${err.message}`, data: null });
    });

    py.on("close", (code) => {
      if (code !== 0 || !constants.data.responseTypes.includes(output)) {
        return resolve({ message: `Python script failed: ${errOutput.trim()}`, data: null });
      }
      return resolve({ message: "Python script succeeded", data: output });
    });
  });
};

export default inferOutputFormat;
