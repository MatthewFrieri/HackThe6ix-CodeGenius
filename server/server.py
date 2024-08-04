from flask import Flask, jsonify, request
from flask_cors import CORS
import groq
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/get-score', methods=['POST'])
def get_score():
    data = request.json

    # Check if 'input_string' is in the request data
    if 'input_string' not in data:
        return jsonify({"error": "input_string is missing"}), 400

    input_string = data['input_string']

    # Generate a review based on the input string using Groq API
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        return jsonify({"error": "API key is missing"}), 500

    client = groq.Groq(api_key=api_key)
    user_content = """
        Review the following code and return an integer value from 1 - 100 rating how good you think the code 
        is based in documentation and straightforwardness. Also give a justification for the score. 
        Format the response as an object with keys score and justification. Code: 
    """ + input_string

    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a concise and precise code reviewer. give a integer from 1 to 100 rating the code and a justification for why. IMPORTANT: ONLY return a JSON object with score and justification IN THIS FORMAT: { score: ___, justification: ___ }. I REPEAT DO NOT USE ANY OTHER FORMAT. Anytime you refer to code, only use line numbers and never include code in your justification"
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

    # return jsonify({"score": '{score: 92, justification: this is my justi}'})
    return jsonify({"score": response_content.strip()})

@app.route('/get-indices', methods=['POST'])
def get_indices():
    data = request.json

    # Check if 'input_string' is in the request data
    if 'input_string' not in data:
        return jsonify({"error": "input_string is missing"}), 400

    input_string = data['input_string']

    # Generate a review based on the input string using Groq API
    api_key = os.getenv('GROQ_API_KEY') # iykyk
    if not api_key:
        return jsonify({"error": "API key is missing"}), 500

    client = groq.Groq(api_key=api_key)
    user_content = """
        Review the code and return JUST a list of lists in the format [[startIndex, endIndex, feedback], [startIndex, endIndex, feedback], ...]
        where startIndex is the first line (inclusive) of a complex portion of code, endIndex
        is the last line (inclusive) of a portion of complex code, and feedback is a justification
        as to why this code is complex.
        Include as many portions of complex code as needed.
        The given code is indexed by a line number, followed by a ~ character, and then the code itself. Please use these line numbers to specify the startIndex and endIndex.
        A complex portion of code is defined as any block that may be ambiguous to someone who is not familiar with the code. Here is the code: "
    """ + input_string

    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """
                    You are a concise and precise code reviewer who is identifying a complex portion of code in a larger codebase.
                    return ONLY a list with 3 values where the first represents startIndex and the second represents endIndex and the third represents feedback.
                    it is CRUCIAL that you ONLY return the list specified. However, the feedback can be as long as needed. Make sure there is enough whitespace between each respective question. Maybe output a whole line worth of space between questions. The user should know each question is different.
                    The feedback should be in 3 parts:
                    1. What is the code doing?
                    2. How does it intertwine with the rest of the code? Ensure you refer to at least one other part of the program when providing your response, but ONLY through line number, NEVER through actual code.
                    3. What are some technical details that make this code complex? Ensure you refer to at least one technical detail in the program, but ONLY through line number, NEVER through actual code.
                    Where applicable, reference relevant sections from your previous knowledge of Python to supplement your answers. NEVER use real Python code in your response.
                """
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

    return jsonify({"indices": response_content.strip()})

if __name__ == '__main__':
    app.run(debug=True)
