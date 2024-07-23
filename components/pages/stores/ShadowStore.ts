import { ChunkData, LOADING } from '../../model';
import { fakeShadowText, isFakeMode } from '../../fakedata';
import { ApiClient } from '../../api';
import { computed, makeAutoObservable, reaction, runInAction } from 'mobx';
import { SettingsStore } from './SettingsStore';

export class ShadowStore {
  audioSrc: string | null = null;
  isRecording = false;
  isLoading = false;
  errorMessage: string | null = null;
  transcriptionData: ChunkData[] = [];
  synthesizedAudioSrc: string | null = null;
  mediaRecorder: MediaRecorder | null = null;
  audioStream: MediaStream | null = null;
  audioChunks: Blob[] = [];

  private _canonicalText: string = isFakeMode() ? fakeShadowText : '';

  isShadowing = false;
  isPaused = false;
  shadowingAudio: HTMLAudioElement | null = null;
  shadowingMediaRecorder: MediaRecorder | null = null;
  shadowingAudioChunks: Blob[] = [];
  shadowingAudioBlob: Blob | null = null;
  isCanonicalTextReadOnly: boolean = false;
  showSynthesizeButton: boolean = true;
  _bestScore: number | undefined | LOADING = undefined;
  _onNewBestScore: ((score: number) => void) | null = null;
  playSoundOnStart: boolean = true; // New property for the checkbox state


  constructor(
    private readonly apiClient: ApiClient,
    private readonly settings: SettingsStore,
  ) {
    makeAutoObservable(this, {
      shadowingScore: computed,
    });
  }

  async ready() {
    return new Promise<void>((resolve) => {
      reaction(() => this.isSelectedAccentLoaded, (isSelectedAccentLoaded) => {
        if (isSelectedAccentLoaded) {
          resolve();
        }
      }, { fireImmediately: true });
    });
  }

  get isSelectedAccentLoaded(): boolean {
    return this.settings.selectedAccent !== undefined;
  }

  get selectedAccent(): string {
    const selectedAccent = this.settings.selectedAccent;
    if (!selectedAccent) {
      throw new Error('Selected accent is not loaded yet');
    }
    return selectedAccent;
  }

  // Add a computed property for score
  get shadowingScore(): number | undefined {
    if (this.transcriptionData.length === 0) {
      return undefined;
    }

    const totalScore = this.transcriptionData.reduce((acc, chunk) => acc + this.calculateChunkScore(chunk), 0);
    return totalScore / this.transcriptionData.length;
  }

  private calculateChunkScore(chunk: ChunkData): number {
    const { selectedAccent } = this;
    const selectedAccentScore = chunk.prediction[selectedAccent] || 0;
    const maxOtherAccentScore = Math.max(
      ...Object.entries(chunk.prediction)
        .filter(([accent]) => accent !== selectedAccent && accent !== 'second language')
        .map(([, score]) => score * 0.5), 0,
    );

    return Math.max(selectedAccentScore, maxOtherAccentScore);
  }

  handleShadowing() {
    if (this.isShadowing) {
      this.handlePauseResumeShadowing();
    } else {
      this.handleStartShadowing();
    }
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
          this.setTranscriptionData(data.chunks);
          this.updateBestScore();
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

    if (this.playSoundOnStart) {
      setTimeout(() => {
        audio.play();
      }, 250);
    }
  }
  updateBestScore() {
    console.log("updateBestScore")
    console.log(this.shadowingScore)
    console.log(this._bestScore)
    const score = this.shadowingScore;
    if (score !== undefined &&
      (this._bestScore === undefined ||
        (typeof (this._bestScore) === 'number' && score > this._bestScore))) {
      this.bestScore = score;
      if (this._onNewBestScore) {
        this._onNewBestScore(score);
      }
    }
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

  get canonicalText(): string {
    return this._canonicalText;
  }

  set canonicalText(value: string) {
    this._canonicalText = value;
  }

  get bestScore(): number | undefined | LOADING {
    return this._bestScore;
  }

  set bestScore(value: number | undefined | LOADING) {
    this._bestScore = value;
  }

  set onNewBestScore(value: (score: number) => void) {
    this._onNewBestScore = value;
  }

  async setCanonicalTextState(text: string) {
    runInAction(() => {
      this.canonicalText = text;
      this.isCanonicalTextReadOnly = true;
      this.showSynthesizeButton = false;
    });
    await this.ready();
    this.handleSynthesize();
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