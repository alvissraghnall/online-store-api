import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CartItemRepository} from '../repositories';
import {CartItem, Product} from '../models';

export class CartItemService {
  constructor(
    @repository(CartItemRepository)
    public cartItemRepo: CartItemRepository,
  ) {}

  async addItemToCart(productId: string, quantity: number, userId: string): Promise<CartItem> {
    const product: Product = await this.cartItemRepo.product(productId)
      .get();
    const cartItem = new CartItem({
      product, quantity
    });
    return this.cartItemRepo.create(cartItem);
  }

  async updateCartItem(cartItemId: string, data: Partial<CartItem>): Promise<void> {
    await this.cartItemRepo.updateById(cartItemId, data);
  }

  async deleteCartItem(cartItemId: string): Promise<void> {
    await this.cartItemRepo.deleteById(cartItemId);
  }

  async cartItemExists(productId: string): Promise<boolean> {
    let product: Product;
    try {
      product = await this.cartItemRepo.product(productId).get();
      return !!product;
    } catch (error) {
      return false;
    } 
  }
}
