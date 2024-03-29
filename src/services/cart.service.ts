import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {Count, Filter, FilterExcludingWhere, Where, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {Cart, CartItem, Product} from '../models';
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
    cart.userId = user[securityId];
    const newCart = await this.cartRepository.create(cart);
    newCart.items = await this.includeProductRelation(newCart.items);
    
    return newCart;
  }

  async addItem(cartItem: CartItem, user: UserProfile): Promise<Cart> {
    const cart = await this.findByUser(user, true);

    // if(cart.userId === user[securityId]) {
    //   throw new HttpErrors[403](`Trying to access cart belonging to another customer`);
    // }

    const product = await this.productService.findById(cartItem.productId);
    if (!product) {
      throw new HttpErrors.NotFound(`Product not found: ${cartItem.productId}`);
    }

    const existingItem = cart.items?.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += cartItem.quantity ?? 1;
      existingItem.updatedAt = new Date();
    } else {
      const newItem: CartItem = new CartItem({productId: product.id, quantity: cartItem.quantity || 1});
      newItem.createdAt = newItem.updatedAt = new Date();
      //  new Date();
      cart.items = [...(cart.items || []), newItem]; // Add the new item to the cart
    }

    const savedCart = await this.cartRepository.save(cart);
    savedCart.items = await this.includeProductRelation(savedCart.items);
    
    return savedCart;
  }

  async removeItem (itemId: string, user: UserProfile): Promise<Cart> {
    const cart = await this.findByUser(user, true);

    if (!cart) {
      throw new HttpErrors.NotFound(`Cart not found for user: ${user[securityId]}`);
    }

    // Find the index of the item to remove
    const itemIndex = cart.items?.findIndex((item) => item.productId === itemId);

    if (itemIndex < 0 || itemIndex === undefined) {
      throw new HttpErrors.NotFound(`Product with ID: ${itemId} not on user cart`);
    }
    
    cart.items?.splice(itemIndex, 1); // Remove the item from the array

    const savedCart = await this.cartRepository.save(cart);
    savedCart.items = await this.includeProductRelation(savedCart.items);
    
    return savedCart;
  }

  async count(where?: Where<Cart>): Promise<Count> {
    return this.cartRepository.count(where);
  }

  async find(filter?: Filter<Cart>): Promise<Cart[]> {
    const carts = await this.cartRepository.find({
      ...filter,
      include: [{
        relation: 'user',
      }],
    });
    for (let cart of carts) {
      cart.items = await this.includeProductRelation(cart.items);
    }
    return carts;
  }

  async findById(id: string, filter?: FilterExcludingWhere<Cart>): Promise<Cart> {
    const cart = await this.cartRepository.findById(id, {
      ...filter,
      include: ['user'],
    });
    if (!cart) {
      throw new HttpErrors.NotFound(`Cart not found: ${id}`);
    }
    cart.items = await this.includeProductRelation(cart.items);
    return cart;
  }

  async findByUser (user: UserProfile, internal?: boolean) {
    const cart = await this.cartRepository.findOne({
      where: { userId: user[securityId] },

    });
    if (!cart) throw new HttpErrors.NotFound(`Cart for user: ${user[securityId]} not found!`);

    if(!internal) {
      cart.items = await this.includeProductRelation(cart.items);
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

  async includeProductRelation (items: CartItem[]) {
    let product: Product;
    for (let item of items) {
      product = await this.productService.findById(item.productId);
      item.product = product;
    }
    return items;
  }
}
