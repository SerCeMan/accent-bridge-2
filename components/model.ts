export interface ChunkData {
  start: number;
  end: number;
  text: string;
  prediction: { [key: string]: number };
}

export interface UploadAudioResponse {
  chunks: ChunkData[];
  image_base64: string
}