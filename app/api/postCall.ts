export async function sendData() {
    try {
      const response = await fetch('http://127.0.0.1:5000/test-endpoint'); // Adjust endpoint as needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(result);

    } catch (error) {
      console.log(error);
    }
  }
