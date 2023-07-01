import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Filter, ObjectType, repository} from '@loopback/repository';
import {ProductRepository} from '../repositories';
import {Product, User} from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '@loopback/authentication-jwt';
import {UserProfile, securityId} from '@loopback/security';

@injectable({scope: BindingScope.TRANSIENT})
export class FavouritesService {
  constructor(
    @repository(ProductRepository) private readonly productRepository: ProductRepository,
    @repository(UserRepository) private readonly userRepository: UserRepository,

  ) {}

  async add (productId: typeof Product.prototype.id, user: UserProfile): Promise<void | Product> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new HttpErrors.NotFound('Product not found!');
    }
    const userModel = await this.userRepository.findById(user[securityId]);
    // userModel?.userCredentials..favourites?.push(product);

    // return this.userRepository.save(userModel);
    console.log(userModel);
  }

  async find(filter?: Filter<Product>): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new HttpErrors.NotFound(`Product not found: ${id}`);
    }
    return product;
  }

  async updateById(id: string, product: Partial<Product>): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  async deleteById(id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
