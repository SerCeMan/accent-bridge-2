import React, { useState, useRef, useEffect } from 'react';
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
  const [audioControl, setAudioControl] = useState<{ stop: () => void } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const chunkStyle = getChunkStyle(chunk.prediction, expectedAccent);

  const handlePlay = () => {
    const control = onPlay(chunk.start, chunk.end);
    setAudioControl(control);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setShowPopover(false);
      if (audioControl) {
        audioControl.stop();
        setAudioControl(null);
      }
    }
  };

  useEffect(() => {
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover, audioControl]);

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
        .popover-content {
          z-index: 10;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
        }
      `}</style>
      <div className="relative inline-block">
        <span
          className={`chunk ${chunkStyle}`}
          onClick={() => setShowPopover(true)}
        >
          {chunk.text}
        </span>
        {showPopover && (
          <div ref={popoverRef} className="popover-content absolute bg-white border border-gray-300 p-2 rounded shadow-lg">
            {Object.entries(chunk.prediction).map(([accent, prob]) => (
              <div key={accent}>{`${accent}: ${(prob * 100).toFixed(2)}%`}</div>
            ))}
            <button onClick={handlePlay} className="mt-2 p-1 bg-blue-500 text-white rounded">
              Play
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default StyledTextChunk;
