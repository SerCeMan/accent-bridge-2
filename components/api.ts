import { UploadAudioResponse } from './model';
import { AuthService } from './services/auth';
import { fakeShadowText, fakeUploadAudioResponse, isFakeMode } from './fakedata';
import { ProfileService } from './services/profiles';

export class ApiClient {
  private apiHost: string;
  private appHost: string;

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {
    this.apiHost = 'https://api.accentbridge.app';
    // this.appHost = 'https://app.accentbridge.app';
    this.appHost = '';
  }

  private getAccessToken(): string {
    const session = this.authService.session;
    if (!session) {
      throw new Error('User is logged out');
    }
    return session.access_token;
  }

  async subscribe() {
    const response = await fetch(`${this.appHost}/api/stripe/subscribe`, {
      method: 'POST',
      body: JSON.stringify(
        {
          stripe_customer_id: this.profileService.stripeCustomer,
        },
      ),
    });
    const sessionUrl = (await response.json()).url;
    window.location.href = sessionUrl;
  }

  async uploadAudio(blob: Blob): Promise<UploadAudioResponse> {
    if (isFakeMode()) {
      return fakeUploadAudioResponse;
    }
    const formData = new FormData();
    formData.append('file', blob, 'audio.wav');

    const response = await fetch(`${this.apiHost}/predict`, {
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
    const response = await fetch(`${this.apiHost}/synthesize`, {
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
