import {Constructor, Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {CartItem, CartItemRelations, Product} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {ProductRepository} from '.';

export class CartItemRepository extends TimeStampRepositoryMixin<
  CartItem,
  typeof CartItem.prototype.id,
  Constructor<DefaultCrudRepository<CartItem, typeof CartItem.prototype.id, CartItemRelations>>
>(DefaultCrudRepository) {

  public readonly product: HasOneRepositoryFactory<
    Product,
    typeof Product.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') readonly dataSource: MongoDataSource,
    @repository.getter('ProductRepository')
    getProductRepository: Getter<ProductRepository>,
  ) {
    super(CartItem, dataSource);
    this.product = this.createHasOneRepositoryFactoryFor(
      'product',
      getProductRepository,
    );
  }
}
