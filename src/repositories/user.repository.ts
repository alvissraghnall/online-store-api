
import {Constructor, Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  juggler,
  repository
} from '@loopback/repository';
import {User, Order, Product} from '../models';
import {UserCredentials} from '../models';
// import {OrderRepository} from './order.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {OrderRepository, ProductRepository} from '.';

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
  public readonly favourites: HasManyRepositoryFactory<Product, typeof User.prototype.id>;

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') readonly dataSource: juggler.DataSource,
    @repository('OrderRepository') public readonly orderRepository: OrderRepository,
    @repository('ProductRepository') public readonly productRepository: ProductRepository,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    // this.orders = this.createHasManyRepositoryFactoryFor(
    //   'orders',
    //   async () => orderRepository,
    // );
    this.favourites = this.createHasManyRepositoryFactoryFor(
      'favourites',
      async () => productRepository,
    );

    this.registerInclusionResolver('favourites',
      this.favourites.inclusionResolver
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
