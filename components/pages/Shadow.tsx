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
import { StyledTextChunk } from '../ui/StyledTextChunk';

import { ShadowStore } from './stores/ShadowStore';

function Score({ score }: { score: number }) {
  const color = score >= 0.75 ? 'text-green-600' : score >= 0.5 ? 'text-yellow-600' : 'text-red-600';
  return (
    <div className="flex justify-center mb-4">
      <span className={`text-lg font-semibold ${color}`}>
        Your score: {Math.round(100 * score)}%
      </span>
    </div>
  );
}

export const Shadow = observer(({ store }: { store: ShadowStore }) => {
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
        {store.shadowingScore !== undefined && (
          <Score score={store.shadowingScore} />
        )}
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
          <IonTitle>Shadow</IonTitle>
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