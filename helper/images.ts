export function uriToBase64(uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const file = uriToFile(uri); // Convert the URI to a File object
      reader.onloadend = () => resolve(reader.result as string); // On successful read, resolve with base64
      reader.onerror = reject; // Reject on error
      reader.readAsDataURL(file); // Start reading as base64
    });
};

export function uriToFile(uri: string): File {
    const url = uri.split(',')[1]; // Extract the base64 part of the data URI
    const byteCharacters = atob(url); // Decode base64 to raw bytes
    const byteArrays = new Uint8Array(byteCharacters.length);
  
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
  
    const file = new File([byteArrays], "image.jpg", { type: "image/jpeg" });
    return file;
  };