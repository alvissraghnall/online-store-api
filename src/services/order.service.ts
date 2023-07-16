import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Count, DataObject, Filter, FilterExcludingWhere, Where, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {Order} from '../models';
import {OrderRepository, UserRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class OrderService {

  constructor(
    @repository(OrderRepository) private readonly orderRepository: OrderRepository,
    @repository(UserRepository) private readonly userRepository: UserRepository,

  ) { }

  async create(order: Partial<Omit<Order, "id">>, user: UserProfile): Promise<Order> {
    order.date = new Date();
    order.status = 'pending';
    // const userInDb = this.userRepository.findById(user[securityId]);

    return this.userRepository.orders(user[securityId]).create(order);
  }

  async count(where?: Where<Order>): Promise<Count> {
    return this.orderRepository.count(where);
  }

  async find(filter?: Filter<Order>) {
    return this.orderRepository.find(filter);
  }

  async findOne(filter: Filter<Order>) {
    return this.orderRepository.findOne(filter);
  }

  async findByUser(user: UserProfile, filter?: Filter<Order>) {
    return this.userRepository.orders(user[securityId]).find();
  }

  async findById(id: string, filter?: FilterExcludingWhere<Order>): Promise<Order> {
    const order = await this.orderRepository.findById(id, filter);
    if (!order) {
      throw new HttpErrors.NotFound(`Order not found: ${id}`);
    }
    return order;
  }

  async updateById(id: string, order: Partial<Order>): Promise<void> {
    await this.orderRepository.updateById(id, order);
  }

  async save (entity: DataObject<Order>) {
    return this.orderRepository.save(entity);
  }

  async deleteById(id: string): Promise<void> {
    await this.orderRepository.deleteById(id);
  }
}
