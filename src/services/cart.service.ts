import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {Count, Filter, FilterExcludingWhere, Where, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {Cart, CartItem} from '../models';
import {CartRepository} from '../repositories';
import {ProductService} from './product.service';

@injectable({scope: BindingScope.TRANSIENT})
export class CartService {
  constructor(
    @repository(CartRepository) private readonly cartRepository: CartRepository,
    @service(ProductService) private readonly productService: ProductService,
  ) {}

  async create(cart: Omit<Cart, "id">, user: UserProfile): Promise<Cart> {
    const existingCart = await this.cartRepository.findOne({
      where: {
        userId: user[securityId]
      },
    });
    if (existingCart) {
      throw new HttpErrors.Conflict('User already has a cart!');
    }
    return this.cartRepository.create(cart);
  }

  async addItem(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId, {
      include: ['items'],
    });

    if (!cart) {
      throw new HttpErrors.NotFound(`Cart not found: ${cartId}`);
    }

    const product = await this.productService.findById(productId);
    if (!product) {
      throw new HttpErrors.NotFound(`Product not found: ${productId}`);
    }

    const existingItem = cart.items?.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      const newItem: CartItem = new CartItem({productId: product.id, quantity: 1});
      cart.items = [...(cart.items || []), newItem]; // Add the new item to the cart
    }

    return this.cartRepository.save(cart);
  }

  async removeItem (cartId: string, itemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId, {
      include: ['items'],
    });

    if (!cart) {
      throw new HttpErrors.NotFound(`Cart not found: ${cartId}`);
    }

    // Find the index of the item to remove
    const itemIndex = cart.items?.findIndex((item) => item.productId === itemId);

    if (itemIndex !== undefined && itemIndex >= 0) {
      cart.items?.splice(itemIndex, 1); // Remove the item from the array
    }

    return this.cartRepository.save(cart);
  }

  async count(where?: Where<Cart>): Promise<Count> {
    return this.cartRepository.count(where);
  }

  async find(filter?: Filter<Cart>): Promise<Cart[]> {
    return this.cartRepository.find(filter);
  }

  async findById(id: string, filter?: FilterExcludingWhere<Cart>): Promise<Cart> {
    const cart = await this.cartRepository.findById(id, filter);
    if (!cart) {
      throw new HttpErrors.NotFound(`Cart not found: ${id}`);
    }
    return cart;
  }

  async updateById(id: string, cart: Partial<Cart>): Promise<void> {
    await this.cartRepository.updateById(id, cart);
  }

  async replaceById(id: string, cart: Cart): Promise<void> {
    await this.cartRepository.replaceById(id, cart);
  }

  async deleteById(id: string): Promise<void> {
    await this.cartRepository.deleteById(id);
  }
}
