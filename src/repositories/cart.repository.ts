import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Cart, CartRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';

export class CartRepository extends TimeStampRepositoryMixin<
  Cart,
  typeof Cart.prototype.id,
  Constructor<DefaultCrudRepository<Cart, typeof Cart.prototype.id, CartRelations>>
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Cart, dataSource);
  }
}
