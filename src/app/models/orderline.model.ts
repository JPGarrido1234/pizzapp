import { Order } from './order.model';
import { Ingredient } from './ingredient.model';
import { Size } from './size.model';
import { Product } from './product.model';
import { Category } from './category.model';

export class OrderLine {
  ingredients: Ingredient[];
  sizes: Size[];
  id: string;
  productId: string;
  productName: string;
  size: string;
  sizeText: string;
  priceUnd: number;
  priceTotal: number | any;
  und: number;
  notes: string;
  ingredientsToRemove: string[];
  ingredientsToAdd: string[];
  ingredientsToRemoveText: string;
  ingredientsToAddText: string;
  image: string;
  half: boolean; // deprecated
  isHalfAndHalf: boolean;
  pizza: boolean;

  order: Order;
  product: Product;
  category: Category;

  constructor(
    order: Order,
    product: Product,
    category: Category,
    ingredients: Ingredient[],
    sizes: Size[]
  ) {
    this.order = order;
    this.product = product;
    this.category = category;
    this.ingredients = ingredients;
    this.sizes = sizes;

    this.id = this.uuidv4();
    (this.productId = product.id), (this.productName = product.name);
    this.und = 1;
    this.notes = '';
    this.size = '';
    this.sizeText = '';
    this.priceUnd = product.price;
    this.image = product.image;
    this.half = false; // deprecated
    this.isHalfAndHalf = false;
    this.pizza = false;
    this.ingredientsToRemove = [];
    this.ingredientsToAdd = [];

    this.ingredientsToAddText = '';
    this.ingredientsToRemoveText = '';

    //if (this.category.isPizzaCategory()) {
    if(this.category.name.toLowerCase().includes('pizzas')) {
      // this.ingredientsToRemove = this.product.ingredients;
      if (this.sizes && this.sizes.length > 0) {
        this.size = this.sizes[0].code;
      }
      this.pizza = true;
    }

    this.calculateTotal();
  }

  removeUnd() {
    if (this.half) {
      this.und = 1;
      return;
    }
    this.und -= 1;
    if (this.und < 1) this.und = 1;
    this.calculateTotal();
  }

  addUnd() {
    if (this.half) {
      this.und = 1;
      return;
    }
    this.und += 1;
    this.calculateTotal();
  }

  setHalf() {
    this.und = 1;
    this.setSize(this.size);
  }

  setHalfAndHalf(val: boolean) {
    this.isHalfAndHalf = val;
  }

  setImage(image: string) {
    this.image = image;
    this.product.image = image;
  }

  calculateTotal() {
    if (!this.category.name.toLowerCase().includes('pizzas')) {
      this.priceTotal = this.und * this.priceUnd;

      if (this.order != null) {
        this.order.calculateTotal();
      }

      return;
    }

    let priceUnd = this.priceUnd;

    if (this.half) {
      priceUnd = priceUnd / 2;
    }

    let size: Size = this.sizes.find((s) => s.code == this.size) as Size;
    let multiplier: number = 1;
    if(size != undefined) {
      multiplier = size.multiplier;
    }

    let numIngredientsToRemove = 0;
    let numIngredientsToAdd = this.ingredientsToAdd.length;

    this.ingredientsToRemove.forEach((ingredientId) => {
      let ingredient: Ingredient | undefined = this.ingredients.find(
        (ingredient) => ingredient.id == ingredientId
      );
      if (!ingredient) {
        throw new Error(`Ingredient with id ${ingredientId} not found`);
      }
      // si es ingrediente base no computa
      if (!ingredient.base) {
        numIngredientsToRemove++;
      }
    });

    let numIngredientsForComputeToIncreasePrice =
      numIngredientsToAdd - numIngredientsToRemove;
    let ingredientObjectsToAdd: Ingredient[] = [];

    this.ingredientsToAdd.forEach((ingredientId) => {
      let ingredient: Ingredient | undefined = this.ingredients.find(
        (ingredient) => ingredient.id == ingredientId
      );
      if (!ingredient) {
        throw new Error(`Ingredient with id ${ingredientId} not found`);
      }
      ingredientObjectsToAdd.push(ingredient);
    });

    // ordenamos el array por precio descendiente
    ingredientObjectsToAdd = ingredientObjectsToAdd.sort((a, b) =>
      a.price < b.price ? 1 : b.price < a.price ? -1 : 0
    );

    for (let i = 0; i < numIngredientsForComputeToIncreasePrice; i++) {
      let ingredient = ingredientObjectsToAdd[i];
      let ingredientPrice: number =
        ingredient.price *
        (multiplier != undefined && multiplier > 0 ? multiplier : 1);
      priceUnd = priceUnd + ingredientPrice;
    }

    this.priceTotal = priceUnd * this.und;

    if (this.order != null) {
      this.order.calculateTotal();
    }
  }

  getMultiplier() {
    if (!this.category.name.toLowerCase().includes('pizzas')) return 1;
    const size = this.sizes.find((s) => s.code == this.size);
    return size ? size.multiplier : 1;
  }

  setIngredientsToRemove(ingredientIds: string[]) {
    this.ingredientsToRemove = ingredientIds;
    this.buildIngredientsText();

    this.calculateTotal();
  }

  setIngredientsToAdd(ingredientIds: string[]) {
    this.ingredientsToAdd = ingredientIds;
    this.buildIngredientsText();

    this.calculateTotal();
  }

  buildIngredientsText() {
    this.ingredientsToRemoveText = '';
    this.ingredientsToRemove.forEach((ingredientId) => {
      let ingredient: Ingredient | undefined = this.ingredients.find(
        (i) => i.id == ingredientId
      );
      if (!ingredient) {
        throw new Error(`Ingredient with id ${ingredientId} not found`);
      }
      if (!ingredient.available) return;
      if (this.ingredientsToRemoveText == '') {
        this.ingredientsToRemoveText = ingredient.name;
      } else {
        this.ingredientsToRemoveText += ', ' + ingredient.name;
      }
    });

    this.ingredientsToAddText = '';
    this.ingredientsToAdd.forEach((ingredientId) => {
      let ingredient: Ingredient | undefined = this.ingredients.find(
        (i) => i.id == ingredientId
      );
      if (!ingredient) {
        throw new Error(`Ingredient with id ${ingredientId} not found`);
      }
      if (this.ingredientsToAddText == '') {
        this.ingredientsToAddText = ingredient.name;
      } else {
        this.ingredientsToAddText += ', ' + ingredient.name;
      }
    });
    this.ingredientsToAddText = this.ingredientsToAddText.trim();
  }

  resetIngredients() {
    this.ingredientsToRemove = [];
    this.ingredientsToAdd = [];
    this.ingredientsToAddText = '';
    this.ingredientsToRemoveText = '';
    this.buildIngredientsText();
  }

  setSize(sizeCode: string) {
    if (sizeCode == undefined || !this.category.name.toLowerCase().includes('pizzas')) return;
    this.setSizeText(sizeCode);
    const size = this.product.sizes.find((s) => s.code == sizeCode);
    if (size) {
      this.priceUnd = size.price !== undefined ? size.price : 0;
    } else {
      throw new Error(`Size with code ${sizeCode} not found`);
    }
    this.calculateTotal();
  }

  setSizeText(code: string) {
    let size : any = this.sizes.find((s) => s.code == code);
    this.size = size.code;
    this.sizeText = size.name;
  }

  setOrder(order: Order) {
    if (order == undefined) return;
    this.order = order;
    this.order.calculateTotal();
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
