from flask import Flask, jsonify, request
from flask_cors import CORS
import groq

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route('/get-score', methods=['POST'])
def generate_response():
    data = request.json

    # Check if 'input_string' is in the request data
    if 'input_string' not in data:
        return jsonify({"error": "input_string is missing"}), 400

    input_string = data['input_string']

    # Generate a review based on the input string using Groq API
    api_key = "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"
    if not api_key:
        return jsonify({"error": "API key is missing"}), 500

    client = groq.Groq(api_key=api_key)
    user_content = f"Review the code and return JUST a integer value from 1 - 100 rating how good you think the code " \
                   f"is based in creativity, documentation and logic: {input_string}"

    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a concise and precise code reviewer. give a integer from 1 to 100 rating the code. return just a integer value"

            },
            {
                "role": "user",
                "content": user_content
            },
        ],
        temperature=0,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response_content = ""
    for chunk in completion:
        response_content += chunk.choices[0].delta.content or ""

    return jsonify({"score": response_content.strip()})


if __name__ == '__main__':
    app.run(debug=True)
