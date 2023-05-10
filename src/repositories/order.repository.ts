import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Order, OrderRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';

export class OrderRepository extends TimeStampRepositoryMixin<
  Order,
  typeof Order.prototype.id,
  Constructor<DefaultCrudRepository<Order, typeof Order.prototype.id, OrderRelations>>
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Order, dataSource);
  }
}
