from flask import Flask, jsonify, request
import groq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/test-endpoint', methods=['GET'])
def test_endpoint():
    # Define some test data
    test_data = {
        "message": "Success"
        }
    return jsonify(test_data)

@app.route('/generate-response', methods=['POST'])
def generate_response():
    data = request.json


    # user_content = "Here is what I want you to process: Here is my code: " + code + ". I am first going to say what information I want, then I will say exactly how i want it formatted. SCORE is a rating out of 100 for how readable and usable the code is. OBJ is an object of this form {startLine: START, endLine: END, feedback: FEEDBACK} where START and END are the lines of a range of a significant portion of code, and FEEDBACK is an explanation of what this code does. This is the format i want returned by you in the end with no additional characters at all. IT IS IMPORTANT THAT YOU DO NOT RETURN ANYTHING EXCEPT THIS FORMAT {score: SCORE, obj: OBJ}"
    user_content = "return an integer from 1 to 100 judging how readable and usable the following code is " + data.code
    api_key = "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"
    if not api_key:
        return jsonify({"error": "API key is missing"}), 500

    client = groq.Groq(api_key=api_key)
    completion = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "you do not chat. you only return what is asked from you in the prompt"
            },
            {
                "role": "user",
                "content": user_content
            },
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response_content = ""
    for chunk in completion:
        response_content += chunk.choices[0].delta.content or ""

    return jsonify({"response": int(response_content)})


if __name__ == '__main__':
    app.run(debug=True)
