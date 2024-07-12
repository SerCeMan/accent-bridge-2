export class ApiClient {
  async uploadAudio(blob: Blob): Promise<any> {
    const formData = new FormData();
    formData.append('file', blob, 'audio.wav');

    const response = await fetch('http://192.168.50.197:5000/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async synthesizeText(text: string, accent: string): Promise<Blob> {
    const response = await fetch('http://192.168.50.197:5001/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, accent }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.blob();
  }
}
