export class Ingredient {
  id: string;
  name: string;
  active: boolean;
  available: boolean;
  price: number;
  base: number;

  constructor(
      id: string,
      name: string,
      active: boolean,
      available: boolean,
      price: number,
      base: number
  ) {
      this.id = id;
      this.name = name;
      this.active = active;
      this.available = available;
      this.price = price;
      this.base = base;
  }
}
