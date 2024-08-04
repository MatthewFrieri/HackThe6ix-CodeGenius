export async function getScore(fileText: string) {
    try {
        const response = await fetch(
        "http://localhost:5000/get-score",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ input_string: fileText }),
        }
        );

        const result = await response.json();        
        return result.score;


    } catch (error) {
        console.error("Error sending file content:", error);
        return 'Err'
    }
}


export async function getIndices(fileText: string) {
    try {
        const response = await fetch(
        "http://localhost:5000/get-indices",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ input_string: fileText }),
        }
        );

        const result = await response.json();
        return result.indices;


    } catch (error) {
        console.error("Error sending file content:", error);
        return 'Err'
    }
}
