import {Constructor, Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Order, OrderRelations, User} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {UserRepository} from './user.repository';

export class OrderRepository extends TimeStampRepositoryMixin<
  Order,
  typeof Order.prototype.id,
  Constructor<DefaultCrudRepository<Order, typeof Order.prototype.id, OrderRelations>>
>(DefaultCrudRepository) {


  public readonly user: BelongsToAccessor<
    User,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserRepository') protected readonly userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Order, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );

    this.registerInclusionResolver('user',
      this.user.inclusionResolver
    );

  }
}
