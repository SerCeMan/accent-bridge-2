export interface ChunkData {
  start: number;
  end: number;
  text: string;
  // e.g. british -> 0.5, us -> 0.4, second accent -> 0.1
  prediction: { [key: string]: number };
}

export interface UploadAudioResponse {
  chunks: ChunkData[];
  image_base64: string
}