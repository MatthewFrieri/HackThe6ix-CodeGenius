export default function CreatePrompt(text: string) {


 return `This is the prompt to pass to llama. Look at the following code and provide explanations on difficult sections. This is the code: ${text}`   
}
