#!/usr/bin/env python3
import sys
import json
import traceback
import os
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()
print("Reading environment variables...", file=sys.stderr, flush=True)
api_key = os.getenv("OPENAI_API_KEY")

class TableRow(BaseModel):
    year: str
    name: str

class Table(BaseModel):
    rows: list[TableRow]

def main():
    try:
        if not api_key:
            raise ValueError("Missing OpenAI API key.")

        client = OpenAI(api_key=api_key)

        # Read stdin JSON
        raw_input = sys.stdin.read().strip()
        if not raw_input:
            raise ValueError("No input received from Node process.")

        input_data = json.loads(raw_input)
        model = input_data.get("model")
        system_instructions = input_data.get("system_instructions")
        user_input = input_data.get("user_input")

        # Log to stderr for debugging
        print("Starting OpenAI request...", file=sys.stderr, flush=True)

        response = client.responses.parse(
            model=model,
            input=[
                {   "role": "system", "content": "Extract data for each row."   },
                {
                    "role": "user",
                    "content": "Return US Open winners from 2000 until last available result. Attributes: year, winner.",
                },
            ],
            instructions=system_instructions,
            text_format=Table,
        )

        # Print result to stdout
        print(json.dumps(response.output_parsed.model_dump()), flush=True)

    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({"error": str(e)}), flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
