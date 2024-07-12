import React, { useState } from 'react';
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
  onPlay: (start: number, end: number) => void;
}> = ({ chunk, expectedAccent, onPlay }) => {
  const [showPopover, setShowPopover] = useState(false);
  const chunkStyle = getChunkStyle(chunk.prediction, expectedAccent);

  const handlePlay = () => {
    onPlay(chunk.start, chunk.end);
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
        .popover-content {
          z-index: 10;
          top: 100%;
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
          <div className="popover-content absolute bg-white border border-gray-300 p-2 rounded shadow-lg">
            {Object.entries(chunk.prediction).map(([accent, prob]) => (
              <div key={accent}>{`${accent}: ${(prob * 100).toFixed(2)}%`}</div>
            ))}
            <button onClick={handlePlay} className="mt-2 p-1 bg-blue-500 text-white rounded">
              Play
            </button>
            <button onClick={() => setShowPopover(false)} className="ml-2 mt-2 p-1 bg-gray-500 text-white rounded">
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default StyledTextChunk;
