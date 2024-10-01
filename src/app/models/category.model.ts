export class Category {
  id: string;
  name: string;
  type: string;
  order: number;

  constructor(
      id: string,
      name: string,
      type: string,
      order: number
  ) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.order = order;
  }

  isPizzaCategory() {
      return this.name.toLowerCase() == 'pizzas';
  }
}
