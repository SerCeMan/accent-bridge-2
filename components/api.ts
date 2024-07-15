import { UploadAudioResponse } from './model';
import { AuthService } from './services/auth';

export class ApiClient {
  constructor(private readonly authService: AuthService) {}

  private getAccessToken(): string {
    const session = this.authService.session;
    if (!session) {
      throw new Error('User is logged out');
    }
    return session.access_token;
  }

  async uploadAudio(blob: Blob): Promise<UploadAudioResponse> {
    const formData = new FormData();
    formData.append('file', blob, 'audio.wav');

    const response = await fetch('http://192.168.50.197:5000/predict', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
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
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify({ text, accent }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.blob();
  }
}
