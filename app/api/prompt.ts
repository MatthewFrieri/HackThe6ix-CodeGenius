export default function CreatePrompt(text: string) {
// we'll use 1-shot prompting as we only got 2048 tokens to work with
 return `The following is a piece of code, with numbered lines. Return these things, in this exact order. First, figure out what the code does overall. Then, determine a score for readability and a score for usability. Then, figure out certain parts of the code that could be hard to understand, and highlight the starting and ending lines these parts of the code lie on. There could be multiple, make sure to highlight at least one. Then, for each one, provide feedback on how you can improve the code that's ambiguous. Here's an example of what I mean:
 Code: def maxSubArray(self, nums: List[int]) -> int:
    max_sum = -inf
    current_sum = 0
    for x in nums:
        current_sum = max(x, current_sum + x)
        max_sum = max(current_sum, max_sum)
    return max_sum
    {score_readability: 4, score_usability: 3, hard_to_understand: [{start: 3, end: 5, feedback: "The variable names are not descriptive enough. Try to make them more descriptive."}]}
    Now, here's the code you need to analyze. Ensure the final output is in JSON format:
    ${text}`   
}
