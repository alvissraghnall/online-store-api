
import {Constructor, Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  HasOneRepositoryFactory,
  juggler,
  repository
} from '@loopback/repository';
import {User, Order, Product, Favourite, Review} from '../models';
import {UserCredentials} from '../models';
// import {OrderRepository} from './order.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {FavouriteRepository, OrderRepository, ProductRepository, ReviewRepository} from '.';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends TimeStampRepositoryMixin<
  User,
  typeof User.prototype.id,
  Constructor<DefaultCrudRepository<
    User,
    typeof User.prototype.id>
  >
>(DefaultCrudRepository) {
  public readonly orders: HasManyRepositoryFactory<Order, typeof User.prototype.id>;
  public readonly reviews: HasManyRepositoryFactory<Review, typeof User.prototype.id>;
  public readonly favourites: HasManyThroughRepositoryFactory<
    Product,
    typeof Product.prototype.id,
    Favourite,
    typeof User.prototype.id
  >;

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') readonly dataSource: juggler.DataSource,
    @repository.getter('OrderRepository') public readonly orderRepositoryGetter: Getter<OrderRepository>,
    @repository.getter('ProductRepository') public readonly productRepositoryGetter: Getter<ProductRepository>,
    @repository.getter('FavouriteRepository') public readonly favouriteRepositoryGetter: Getter<FavouriteRepository>,
    @repository.getter('ReviewRepository') public readonly reviewRepositoryGetter: Getter<ReviewRepository>,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,

  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.orders = this.createHasManyRepositoryFactoryFor(
      'orders',
      orderRepositoryGetter,
    );
    this.reviews = this.createHasManyRepositoryFactoryFor(
      'reviews',
      reviewRepositoryGetter,
    );
    this.favourites = this.createHasManyThroughRepositoryFactoryFor(
      'favourites',
      productRepositoryGetter,
      favouriteRepositoryGetter
    );

    this.registerInclusionResolver('favourites',
      this.favourites.inclusionResolver
    );

    this.registerInclusionResolver('orders',
      this.orders.inclusionResolver
    );

    this.registerInclusionResolver('reviews',
      this.reviews.inclusionResolver
    );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
