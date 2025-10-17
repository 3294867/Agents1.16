#!/usr/bin/env python3
import sys, json, traceback, os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

def main():
    try:
        if not api_key:
            raise ValueError("Missing OpenAI API key.")
        client = OpenAI(api_key=api_key)

        raw_input = sys.stdin.read().strip()
        if not raw_input:
            raise ValueError("No input received.")
        input_data = json.loads(raw_input)
        user_input = input_data.get("userInput")

        response = client.responses.parse(
            model="gpt-5-nano",
            input=[
                {
                    "role": "system",
                    "content": (
                        "Respond using a clear and concise bullet list.\n"
                        "Each bullet should represent one main idea, step, or fact.\n"
                        "Use '-' for bullets and no numbering."
                    ),
                },
                {"role": "user", "content": user_input},
            ],
        )

        print(response.output_text.strip(), flush=True)

    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({"error": str(e)}), flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
