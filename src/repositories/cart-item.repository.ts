import {Constructor, Getter, inject} from '@loopback/core';
import {type BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {CartItem, CartItemRelations, Product} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {ProductRepository} from '.';

export class CartItemRepository extends TimeStampRepositoryMixin<
  CartItem,
  typeof CartItem.prototype.productId,
  Constructor<DefaultCrudRepository<CartItem, typeof CartItem.prototype.productId, CartItemRelations>>
>(DefaultCrudRepository) {

  public readonly product: BelongsToAccessor<
    Product,
    typeof Product.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') readonly dataSource: MongoDataSource,
    @repository.getter('ProductRepository') protected readonly getProductRepository: Getter<ProductRepository>,

  ) {
    super(CartItem, dataSource);
    // this.product = this.createHasOneRepositoryFactoryFor(
    //   'product',
    //   getProductRepository,
    // );

    this.product = this.createBelongsToAccessorFor(
      'product',
      getProductRepository,
    );

    this.registerInclusionResolver('product',
      this.product.inclusionResolver
    );
  }
}
