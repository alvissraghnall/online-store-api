import {injectable, /* inject, */ BindingScope, service} from '@loopback/core';
import {Count, Filter, FilterExcludingWhere, Where, repository} from '@loopback/repository';
import {CartItemRepository, CartRepository} from '../repositories';
import {Cart, Product} from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
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

  async addItem (cartId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new HttpErrors.NotFound(`Cart not found: ${cartId}`);
    }
    const product = await this.productService.findById(productId);

    const cartItem = this.cartRepository.items(cartId).find({
      where: {
        product: {...product}
      },
    })
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({productId, quantity});
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
