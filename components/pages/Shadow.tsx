import { useEffect } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { observer } from 'mobx-react-lite';

import { makeAutoObservable, runInAction } from 'mobx';
import { ChunkData } from '../model';
import StyledTextChunk from '../ui/StyledTextChunk';
import { SettingsStore } from './Settings';
import { ApiClient } from '../api';
import { isFakeMode, fakeShadowText } from '../fakedata';

export class ShadowPageStore {
  imageSrc: string | null = null;
  audioSrc: string | null = null;
  isRecording = false;
  isLoading = false;
  errorMessage: string | null = null;
  transcriptionData: ChunkData[] = [];
  synthesizedAudioSrc: string | null = null;
  mediaRecorder: MediaRecorder | null = null;
  audioStream: MediaStream | null = null;
  audioChunks: Blob[] = [];

  canonicalText: string = isFakeMode() ? fakeShadowText : '';

  isShadowing = false;
  isPaused = false;
  shadowingAudio: HTMLAudioElement | null = null;
  shadowingMediaRecorder: MediaRecorder | null = null;
  shadowingAudioChunks: Blob[] = [];
  shadowingAudioBlob: Blob | null = null;

  constructor(
    private readonly apiClient: ApiClient,
    private readonly settings: SettingsStore,
  ) {
    makeAutoObservable(this);
  }

  get selectedAccent(): string {
    return this.settings.selectedAccent;
  }

  async handleStartShadowing() {
    if (!this.synthesizedAudioSrc) {
      this.setErrorMessage('Please synthesize text before shadowing.');
      return;
    }
    // ensure to disable audio processing features to avoid interference with
    // the synthesized audio playing in the background
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    this.setIsShadowing(true);
    this.setIsPaused(false);

    const shadowingMediaRecorder = new MediaRecorder(stream);
    const audio = new Audio(this.synthesizedAudioSrc);
    audio.currentTime = 0;

    runInAction(() => {
      this.shadowingAudioChunks = [];
      this.audioStream = stream;
      this.shadowingMediaRecorder = shadowingMediaRecorder;
      this.shadowingAudio = audio;
    });

    shadowingMediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        runInAction(() => {
          this.shadowingAudioChunks.push(event.data);
        });
      }
    };

    shadowingMediaRecorder.onstop = async () => {
      const audioBlob = new Blob(this.shadowingAudioChunks, { type: 'audio/wav' });
      if (audioBlob.size === 0) {
        console.error('Recorded shadowing audio blob is empty.');
        return;
      }

      const audioURL = URL.createObjectURL(audioBlob);
      this.setAudioSrc(audioURL);

      runInAction(() => {
        this.shadowingAudioBlob = audioBlob;
      });

      this.setIsLoading(true);
      try {
        const data = await this.apiClient.uploadAudio(audioBlob);
        runInAction(() => {
          this.setImageSrc(`data:image/png;base64,${data.image_base64}`);
          this.setTranscriptionData(data.chunks);
        });
      } catch (error) {
        console.error('Error uploading shadowing audio:', error);
        this.setErrorMessage('Error uploading shadowing audio');
      } finally {
        this.setIsLoading(false);
        if (this.audioStream) {
          this.audioStream.getTracks().forEach(track => track.stop());
          this.audioStream = null;
        }
        this.setIsShadowing(false);
      }
    };

    shadowingMediaRecorder.start();
    setTimeout(() => {
      audio.play();
    }, 2000);
  }

  handleStopShadowing() {
    if (this.shadowingMediaRecorder && this.isShadowing) {
      this.shadowingMediaRecorder.stop();
      this.shadowingAudio?.pause();
      this.setIsShadowing(false);
    }
  }

  handlePauseResumeShadowing() {
    if (this.shadowingMediaRecorder && this.isShadowing) {
      if (this.isPaused) {
        this.shadowingMediaRecorder.resume();
        this.shadowingAudio?.play();
      } else {
        this.shadowingMediaRecorder.pause();
        this.shadowingAudio?.pause();
      }
      this.setIsPaused(!this.isPaused);
    }
  }

  // Utility setters to ensure state changes are tracked by MobX
  setIsShadowing(value: boolean) {
    this.isShadowing = value;
  }

  setIsPaused(value: boolean) {
    this.isPaused = value;
  }

  get rawText(): string {
    return this.transcriptionData.map((chunk: ChunkData) => chunk.text).join(' ');
  }

  async handleStartStopRecording() {
    if (this.isRecording) {
      this.handleStopRecording();
    } else {
      await this.handleStartRecording();
    }
  }

  async handleStartRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      runInAction(() => {
        this.audioStream = stream;
        this.setIsRecording(true);
        this.setImageSrc(null);
        this.setErrorMessage(null);
      });
      const mediaRecorder = new MediaRecorder(stream);

      runInAction(() => {
        this.audioChunks = [];
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          runInAction(() => {
            this.audioChunks.push(event.data);
          });
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        if (audioBlob.size === 0) {
          console.error('Recorded audio blob is empty.');
          return;
        }

        const audioURL = URL.createObjectURL(audioBlob);
        this.setAudioSrc(audioURL);

        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');

        this.setIsLoading(true);
        try {
          const response = await fetch('http://192.168.50.197:5000/predict', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          runInAction(() => {
            this.setImageSrc(`data:image/png;base64,${data.image_base64}`);
            this.setTranscriptionData(data.chunks);
          });
        } catch (error) {
          console.error('Error uploading audio:', error);
          this.setErrorMessage('Error uploading audio');
        } finally {
          this.setIsLoading(false);
          if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
          }
        }
      };

      runInAction(() => {
        this.mediaRecorder = mediaRecorder;
      });
      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      this.setIsRecording(false);
    }
  }

  handleStopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.setIsRecording(false);
    }
  }

  async handleSynthesize() {
    const text = this.canonicalText;
    const accent = this.selectedAccent;

    if (!text) {
      this.setErrorMessage('Please enter text first');
      return;
    }

    this.setIsLoading(true);
    this.setErrorMessage(null);
    this.setSynthesizedAudioSrc(null);

    try {
      const audioBlob = await this.apiClient.synthesizeText(text, accent);
      const audioURL = URL.createObjectURL(audioBlob);
      this.setSynthesizedAudioSrc(audioURL);
    } catch (error) {
      console.error('Error synthesizing audio:', error);
      this.setErrorMessage('Error synthesizing audio');
    } finally {
      this.setIsLoading(false);
    }
  }

  handlePlayChunk(start: number, end: number) {
    if (!this.shadowingAudioBlob) {
      console.error('Invalid audio blob');
      return null;
    }

    const audioURL = URL.createObjectURL(this.shadowingAudioBlob);
    const audio = new Audio(audioURL);
    audio.currentTime = start;

    const handleTimeUpdate = () => {
      if (audio.currentTime >= end) {
        audio.pause();
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.play();

    return {
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      },
    };
  }

  setIsRecording(value: boolean) {
    this.isRecording = value;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  setImageSrc(value: string | null) {
    this.imageSrc = value;
  }

  setAudioSrc(value: string | null) {
    this.audioSrc = value;
  }

  setErrorMessage(value: string | null) {
    this.errorMessage = value;
  }

  setTranscriptionData(value: ChunkData[]) {
    this.transcriptionData = value;
  }

  setSynthesizedAudioSrc(value: string | null) {
    this.synthesizedAudioSrc = value;
  }
}

export const Shadow = observer(({ store }: { store: ShadowPageStore }) => {
  useEffect(() => {
    return () => {
      const audios = document.querySelectorAll('audio');
      audios.forEach((audio) => audio.pause());
    };
  }, []);

  const handleShadowing = () => {
    if (store.isShadowing) {
      store.handlePauseResumeShadowing();
    } else {
      store.handleStartShadowing();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {!store.isLoading && store.errorMessage && (
        <p className="text-red-600">{store.errorMessage}</p>
      )}
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <IonButton
            onClick={() => store.handleSynthesize()}
            color="success"
            className="mr-2"
          >
            Synthesize
          </IonButton>
          <IonButton
            onClick={handleShadowing}
            color={store.isShadowing ? 'danger' : 'success'}
            disabled={!store.synthesizedAudioSrc}
            className="mr-2"
          >
            {store.isShadowing && !store.isPaused ? 'Pause' : store.isShadowing ? 'Resume' : 'Start'}
          </IonButton>
          <IonButton
            onClick={() => store.handleStopShadowing()}
            color="danger"
            disabled={!store.isShadowing}
          >
            Stop
          </IonButton>
        </div>
        <div style={{ height: '30em' }} className="flex flex-row">
          <div className="flex flex-col items-center justify-center h-full w-1/2">
            {store.synthesizedAudioSrc && (
              <audio controls src={store.synthesizedAudioSrc} className="w-full mt-4">
                Your browser does not support the audio element.
              </audio>
            )}
            <textarea
              className="w-full h-full border rounded"
              placeholder="Enter text you want to shadow..."
              rows={5}
              value={store.canonicalText}
              onChange={(e) => (store.canonicalText = e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center justify-center h-full w-1/2 overflow-y-auto"
               style={{ maxHeight: '30em' }}>
            {store.audioSrc && (
              <audio controls src={store.audioSrc} className="w-full mt-4">
                Your browser does not support the audio element.
              </audio>
            )}
            <div className="flex flex-col border rounded h-full w-full overflow-y-auto">
              {store.transcriptionData.map((chunk, index) => (
                <StyledTextChunk
                  key={index}
                  chunk={chunk}
                  expectedAccent={store.selectedAccent}
                  onPlay={(start, end) => store.handlePlayChunk(start, end)}
                />
              ))}
            </div>
          </div>
        </div>
        {store.isLoading && <p className="text-blue-600">Loading...</p>}
      </div>
    </div>
  );
});

export const ShadowSkeleton = ({ children }: { children: React.ReactNode }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shadowing</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {children}
      </IonContent>
    </IonPage>
  );
};