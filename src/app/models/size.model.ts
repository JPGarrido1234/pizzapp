export class Size {
  code: string;
  name: string;
  multiplier: number;

  constructor(
      code: string,
      name: string,
      multiplier: number
  ) {
      this.code = code;
      this.name = name;
      this.multiplier = multiplier;
  }
}
