import {injectable, /* inject, */ BindingScope, service} from '@loopback/core';
import {Count, Filter, FilterExcludingWhere, Where, repository} from '@loopback/repository';
import {ProductRepository, ReviewRepository, UserRepository} from '../repositories';
import { Product, Review } from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {ProductService} from './product.service';

@injectable({scope: BindingScope.TRANSIENT})
export class ReviewService {

  constructor(
    @repository(ReviewRepository) private readonly reviewRepository: ReviewRepository,
    @repository(UserRepository) private readonly userRepository: UserRepository,
    @service(ProductService) private readonly productService: ProductService,

  ) {}

  async create(review: Omit<Review, "id" | "userId">, user: UserProfile): Promise<Review> {
    const productExists: Awaited<Product> = await this.productService.findById(review.productId);

    return this.userRepository.reviews(user[securityId]).create(review);
  }

  async count(where?: Where<Review>): Promise<Count> {
    return this.reviewRepository.count(where);
  }

  async find(filter?: Filter<Review>) {
    return this.reviewRepository.find(filter);
  }

  async findByUser (user: UserProfile, filter?: Filter<Review>) {
    return this.userRepository.reviews(user[securityId]).find();
  }

  async findById(id: string, filter?: FilterExcludingWhere<Review>): Promise<Review> {
    const review = await this.reviewRepository.findById(id, filter);
    if (!review) {
      throw new HttpErrors.NotFound(`Review not found: ${id}`);
    }
    return review;
  }

  async updateById(id: string, review: Partial<Review>): Promise<void> {
    await this.reviewRepository.updateById(id, review);
  }

  async replaceById(id: string, review: Partial<Review>): Promise<void> {
    await this.reviewRepository.replaceById(id, review);
  }

  async updateAll(review: Partial<Review>, where?: Where<Review>): Promise<Count> {
    return await this.reviewRepository.updateAll(review, where);
  }

  async deleteById(id: string): Promise<void> {
    await this.reviewRepository.deleteById(id);
  }

  async deleteAll () {
    await this.reviewRepository.deleteAll();
  }
}
