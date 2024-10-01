export class Gap {
  text: string;
  available: boolean;
  timestamp: number;

  constructor(text: string, available: boolean, timestamp: number) {
      this.text = text;
      this.available = available;
      this.timestamp = timestamp;
  }
}
