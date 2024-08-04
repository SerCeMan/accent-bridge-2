import { UploadAudioResponse } from './model';
import { AuthService } from './services/auth';
import { fakeUploadAudioResponse, isFakeMode } from './fakedata';
import { ProfileService } from './services/profiles';

export class ApiClient {
  private appHost: string;

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {
    this.appHost = '';
  }

  private getAccessToken(): string {
    const session = this.authService.session;
    if (!session) {
      throw new Error('User is logged out');
    }
    return `${session.access_token},${session.refresh_token}`;
  }

  async subscribe(): Promise<string> {
    const req = {
      stripe_customer_id: this.profileService.stripeCustomer,
    };
    const response = await fetch(`${this.appHost}/api/stripe/subscribe`, {
      method: 'POST',
      body: JSON.stringify(req),
    });
    const res = await response.json();
    return res.url;
  }

  async manageStripePortal() {
    const req = {
      stripe_customer_id: this.profileService.stripeCustomer,
    };
    const response = await fetch(`${this.appHost}/api/stripe/manage`, {
      method: 'POST',
      body: JSON.stringify(req),
    });
    const res = await response.json();
    return res.url;
  }

  async uploadAudio(blob: Blob): Promise<UploadAudioResponse> {
    if (isFakeMode()) {
      return fakeUploadAudioResponse;
    }
    const formData = new FormData();
    formData.append('file', blob, 'audio.wav');

    const response = await fetch(`${this.appHost}/api/ml/predict-accent`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `${this.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async synthesizeText(text: string, accent: string): Promise<Blob> {
    const response = await fetch(`${this.appHost}/api/ml/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${this.getAccessToken()}`,
      },
      body: JSON.stringify({ text, accent }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.blob();
  }
}
