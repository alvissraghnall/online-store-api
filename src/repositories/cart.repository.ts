import {Constructor, Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, BelongsToAccessor, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Cart, CartItem, CartRelations, User} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {UserRepository} from './user.repository';
import {CartItemRepository} from './cart-item.repository';

export class CartRepository extends TimeStampRepositoryMixin<
  Cart,
  typeof Cart.prototype.id,
  Constructor<DefaultCrudRepository<Cart, typeof Cart.prototype.id, CartRelations>>
>(DefaultCrudRepository) {

  public readonly user: BelongsToAccessor<
    User,
    typeof User.prototype.id
  >;

  // public readonly items: HasManyRepositoryFactory<
  //   CartItem,
  //   typeof CartItem.prototype.productId
  // >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserRepository') protected readonly userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('CartItemRepository') protected readonly cartItemsRepositoryGetter: Getter<CartItemRepository>,
  ) {
    super(Cart, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );

    // this.items = this.createHasManyRepositoryFactoryFor(
    //   'items',
    //   cartItemsRepositoryGetter,
    // );
  }
}
