import React, { useState, useRef } from 'react';
import { IonPopover, IonButton } from '@ionic/react';
import { ChunkData } from '../model';

const getChunkStyle = (prediction: { [key: string]: number }, expectedAccent: string) => {
  const matchedPredictions = prediction[expectedAccent];
  if (matchedPredictions > 0.8) {
    return 'high-match';
  }
  const secondLangPrediction = prediction["second language"];
  if (secondLangPrediction > 0.6) {
    return 'low-match';
  }
  return 'medium-match';
};

const StyledTextChunk: React.FC<{
  chunk: ChunkData;
  expectedAccent: string;
  onPlay: (start: number, end: number) => { stop: () => void } | null;
}> = ({ chunk, expectedAccent, onPlay }) => {
  const [showPopover, setShowPopover] = useState(false);
  const chunkId = `chunk-${chunk.start}-${chunk.end}`;

  const chunkStyle = getChunkStyle(chunk.prediction, expectedAccent);

  const handlePlay = () => {
    const control = onPlay(chunk.start, chunk.end);
    control && control.stop();
  };

  return (
    <>
      <style jsx>{`
        .chunk {
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          margin-right: 2px;
          display: inline-block;
        }
        .high-match {
          background-color: #32CD32; /* Green for high match */
        }
        .medium-match {
          background-color: #FFD700; /* Yellow for medium match */
        }
        .low-match {
          background-color: #DC143C; /* Red for low match */
        }
      `}</style>
      <div className="relative inline-block">
        <span
          id={chunkId}
          className={`chunk ${chunkStyle}`}
          onClick={() => setShowPopover(true)}
        >
          {chunk.text}
        </span>
        <IonPopover
          isOpen={showPopover}
          onDidDismiss={() => setShowPopover(false)}
          trigger={chunkId}
        >
          <div className="popover-content p-2">
            {Object.entries(chunk.prediction).map(([accent, prob]) => (
              <div key={accent}>{`${accent}: ${(prob * 100).toFixed(2)}%`}</div>
            ))}
            <IonButton onClick={handlePlay} className="mt-2" expand="block">
              Play
            </IonButton>
          </div>
        </IonPopover>
      </div>
    </>
  );
};

export default StyledTextChunk;
