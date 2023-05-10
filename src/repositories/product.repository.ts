import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';

export class ProductRepository extends TimeStampRepositoryMixin<
  Product,
  typeof Product.prototype.id,
  Constructor<DefaultCrudRepository<Product, typeof Product.prototype.id, ProductRelations>>
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Product, dataSource);
  }
}
