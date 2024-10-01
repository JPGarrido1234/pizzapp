import { ProductSize } from './productsize.model';
import { ProductService } from '../service/product.service';
import { Ingredient } from './ingredient.model';

export class Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pizza: boolean;
  active: boolean;
  available: boolean;
  order: number;
  allergens: string[];
  sizes: ProductSize[];
  ingredients: string[];
  ingredientsNotAvailable: string[];
  image: string;
  type: string;

  productService: ProductService;
  allIngredients: Ingredient[];

  constructor(
    data: any,
    productService: ProductService,
    allIngredients: Ingredient[]
  ) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.pizza = data.pizza;
    this.active = data.active;
    this.available = data.available;
    this.order = data.order;
    this.allergens = data.allergens;
    this.sizes = data.sizes;
    this.ingredients = data.ingredients;
    this.ingredientsNotAvailable = [];
    this.image = 'assets/imgs/white.png';
    this.type = data.type;

    this.productService = productService;
    this.allIngredients = allIngredients;

    if (this.id != 'half') {
      this.getImage();
    }

    this.setIngredientsNotAvailable();
  }

  getImage() {
    this.productService.getImageUrl(this.id).subscribe((image: any) => {
      if (image != null && image.data != '' && image.type != null) {
        this.image = 'data:' + image.type + ';base64,' + image.data;
      } else {
        this.image = 'assets/imgs/no-image.png';
      }
    });
  }

  setIngredientsNotAvailable() {
    this.ingredients.forEach((ingredientId) => {
      try {
        const found = this.allIngredients.filter(
          (ingredient) => ingredient.id === ingredientId
        )[0];
        if (!found.available) {
          this.ingredientsNotAvailable.push(found.name);
        }
      } catch (e) {}
    });
  }
}
