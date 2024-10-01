import { OrderLine } from './orderline.model';

export class Order {
  name: string = '';
  number: string = '';
  phone: string = '';
  email: string = '';
  pickupTime: string = '';
  orderStatus: string = 'WAITING';
  total: number = 0;
  notes: string = '';
  unds: number = 0;
  lines: OrderLine[] = [];
  userId: string = '';
  date: string = '';

  constructor() {}

  removeLine(line: OrderLine) {
    let newLines: any = [];
    this.lines.forEach((l) => {
      if (l.id != line.id) {
        newLines.push(l);
      }
    });
    this.lines = newLines;
    this.calculateTotal();
  }

  addLine(line: OrderLine) {
    this.lines.push(line);
    this.calculateTotal();
  }

  calculateTotal() {
    this.unds = 0;
    this.total = 0;
    this.lines.forEach((line) => {
      this.total += line.priceTotal;
      this.unds += line.und;
    });
  }

  isOk() {
    if (this.total == 0 || this.lines.length < 1) {
      throw 'Pedido sin productos';
    }

    let half = 0;
    this.lines.forEach((line) => {
      if (line.half) {
        half++;
      }
    });
    if (half % 2 > 0) {
      throw 'Tienes que pedir otra media pizza para completar el pedido';
    }

    if (this.name == '') {
      throw 'Tienes que indicar un nombre de pedido';
    }

    if (this.phone == '') {
      throw 'Tienes que indicarnos tu número de teléfono';
    }

    if (this.email == '') {
      throw 'Tienes que indicarnos tu email';
    }

    if (this.pickupTime == '') {
      throw 'Tienes que especificar la hora de recogida del pedido';
    }
  }

  clear() {
    this.pickupTime = '';
    this.total = 0;
    this.unds = 0;
    this.notes = '';
    this.lines = [];
  }

  prepareToPost() {
    this.lines.forEach((line: any) => {
      delete line.order;
      delete line.image;
      delete line.ingredients;
      delete line.product;
    });

    let order = JSON.parse(JSON.stringify(this));

    order.lines.forEach((line: any) => {
      delete line.id;
      delete line.image;
      delete line.category;
      delete line.product;
      delete line.sizes;
      delete line.ingredients;
    });

    return order;
  }

  getPizzasUnd() {
    let unds = 0;
    this.lines.forEach((line) => {
      if (line.pizza) {
        unds += line.half ? 0.5 : line.und;
      }
    });
    return parseInt(unds.toString());
  }
}
