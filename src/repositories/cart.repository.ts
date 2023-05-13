import {Constructor, Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, BelongsToAccessor, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Cart, CartRelations, User} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {UserRepository} from './user.repository';

export class CartRepository extends TimeStampRepositoryMixin<
  Cart,
  typeof Cart.prototype.id,
  Constructor<DefaultCrudRepository<Cart, typeof Cart.prototype.id, CartRelations>>
>(DefaultCrudRepository) {

  public readonly user: BelongsToAccessor<
    User,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserRepository') protected readonly userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Cart, dataSource);
    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
  }
}
