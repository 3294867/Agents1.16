#!/usr/bin/env python3
import sys
import json
import traceback
import os
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
            raise ValueError("No input received from Node process.")

        input_data = json.loads(raw_input)
        user_input = input_data.get("userInput")

        print("Starting OpenAI request...", file=sys.stderr, flush=True)

        response = client.responses.parse(
            model="gpt-5-nano",
            input=[
                {
                    "role": "system",
                    "content": (
                        "You are a formatting selector. Based on the user query, decide the most suitable output type.\n"
                        "Available types:\n"
                        "- paragraph → for descriptive or explanatory answers\n"
                        "- bullet-list → for items, steps, or enumerations\n"
                        "- table → for structured data like years, stats, or comparisons\n\n"
                        "Respond with exactly one word: 'paragraph', 'bullet-list', or 'table'."
                    ),
                },
                {"role": "user", "content": user_input},
            ],
        )

        # Print only the type (trim to avoid accidental extra text)
        print(response.output_text.strip(), flush=True)

    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({"error": str(e)}), flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
