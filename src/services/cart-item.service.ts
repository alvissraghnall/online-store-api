// import {inject, service} from '@loopback/core';
// import {repository} from '@loopback/repository';
// import {CartItemRepository} from '../repositories';
// import {CartItem, Product} from '../models';
// import {ProductService} from './product.service';

// export class CartItemService {
//   constructor(
//     @repository(CartItemRepository)
//     public cartItemRepo: CartItemRepository,
//     @service(ProductService) private readonly productService: ProductService
//   ) {}

//   async addItemToCart(productId: string): Promise<CartItem> {
//     const product: Product = await this.productService.findById(productId);

//     const cartItem = new CartItem({
//       productId, quantity
//     });
//     return this.cartItemRepo.create(cartItem);
//   }

//   async getCartItems () {}

//   async updateCartItem(cartItemId: string, data: Partial<CartItem>): Promise<void> {
//     await this.cartItemRepo.updateById(cartItemId, data);
//   }

//   async deleteCartItem(cartItemId: string): Promise<void> {
//     await this.cartItemRepo.deleteById(cartItemId);
//   }

//   async cartItemExists(productId: string): Promise<boolean> {
//     let product: Product;
//     try {
//       product = await this.cartItemRepo.product(productId).get();
//       return !!product;
//     } catch (error) {
//       return false;
//     }
//   }
// }
