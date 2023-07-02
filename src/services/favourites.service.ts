import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Filter, ObjectType, repository} from '@loopback/repository';
import {FavouriteRepository, ProductRepository} from '../repositories';
import {Product, User} from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories/user.repository';
import {UserProfile, securityId} from '@loopback/security';

@injectable({scope: BindingScope.TRANSIENT})
export class FavouritesService {
  constructor(
    @repository(ProductRepository) private readonly productRepository: ProductRepository,
    @repository(UserRepository) private readonly userRepository: UserRepository,
    @repository(FavouriteRepository) private readonly favouriteRepository: FavouriteRepository,

  ) {}

  async add (productId: typeof Product.prototype.id, user: UserProfile): Promise<void | User> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new HttpErrors.NotFound('Product with id: ' + productId + ' not found!');
    }
    // const userModel = await this.userRepository.findById(user[securityId]);

    const existingFavorite = await this.favouriteRepository.findOne({
      where: {
        userId: user[securityId],
        productId,
      },
    });

    if (existingFavorite) {
      await this.favouriteRepository.deleteById(existingFavorite.id);
    } else {
      await this.favouriteRepository.create({
        userId: user[securityId],
        productId,
      });
    }
    // userModel?.userCredentials..favourites?.push(product);

    // return this.userRepository.save(userModel);
    // console.log(userModel);
    return await this.userRepository.findById(user[securityId], {
      include: ['favourites']
    });;
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
