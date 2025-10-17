#!/usr/bin/env python3
import sys, json, traceback, os
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Optional

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

class TableRow(BaseModel):
    year: Optional[str] = None
    name: Optional[str] = None
    value: Optional[str] = None

class Table(BaseModel):
    rows: List[TableRow]

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
                        "Respond to the user's request as a table.\n"
                        "Infer appropriate column names such as year, name, or value.\n"
                        "Ensure the data is consistent and complete."
                    ),
                },
                {"role": "user", "content": user_input},
            ],
            response_format=Table,
        )

        # Output rows as JSON
        print(json.dumps([row.dict() for row in response.output_parsed.rows], ensure_ascii=False), flush=True)

    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({"error": str(e)}), flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
