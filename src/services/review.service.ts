import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Count, Filter, FilterExcludingWhere, ObjectType, Where, repository} from '@loopback/repository';
import {OrderRepository, ProductRepository, ReviewRepository, UserRepository} from '../repositories';
import { Order, Product} from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';

@injectable({scope: BindingScope.TRANSIENT})
export class ReviewService {

  constructor(
    @repository(ReviewRepository) private readonly reviewRepository: ReviewRepository,
    @repository(UserRepository) private readonly userRepository: UserRepository,

  ) {}

  async create(order: Partial<Omit<Order, "id">>, user: UserProfile): Promise<Order> {

    return this.userRepository.orders(user[securityId]).create(order);
  }

  async count(where?: Where<Order>): Promise<Count> {
    return this.orderRepository.count(where);
  }

  async find(filter?: Filter<Order>) {
    return this.orderRepository.find(filter);
  }

  async findByUser (user: UserProfile, filter?: Filter<Order>) {
    return this.userRepository.orders(user[securityId]).find();
  }

  async findById(id: string, filter?: FilterExcludingWhere<Order>): Promise<Order> {
    const order = await this.orderRepository.findById(id, filter);
    if (!order) {
      throw new HttpErrors.NotFound(`Order not found: ${id}`);
    }
    return order;
  }

  // async updateById(id: string, order: Partial<Order>): Promise<void> {
  //   await this.orderRepository.updateById(id, order);
  // }

  async deleteById(id: string): Promise<void> {
    await this.orderRepository.deleteById(id);
  }
}
