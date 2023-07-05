import {Constructor, Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {Product, Review, ReviewRelations, User} from '../models';
import {ProductRepository} from './product.repository';
import {UserRepository} from '../repositories';

export class ReviewRepository extends TimeStampRepositoryMixin<
  Review,
  typeof Review.prototype.id,
  Constructor<DefaultCrudRepository<Review, typeof Review.prototype.id, ReviewRelations>>
>(DefaultCrudRepository) {

  public readonly user: BelongsToAccessor<
    User,
    typeof User.prototype.id
  >;

  public readonly product: BelongsToAccessor<
    Product,
    typeof Product.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserRepository') protected readonly userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('ProductRepository') protected readonly productRepositoryGetter: Getter<ProductRepository>,

  ) {
    super(Review, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
    this.product = this.createBelongsToAccessorFor(
      'product',
      productRepositoryGetter,
    );

    this.registerInclusionResolver('user',
      this.user.inclusionResolver
    );
    
    this.registerInclusionResolver('product',
      this.product.inclusionResolver
    );



  }
}
