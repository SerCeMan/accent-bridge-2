export interface ChunkData {
  start: number;
  end: number;
  text: string;
  prediction: { [key: string]: number };
}