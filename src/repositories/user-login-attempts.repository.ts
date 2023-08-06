import {Constructor, Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {User, UserLoginAttempts, UserLoginAttemptsRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {UserRepository} from './user.repository';

export class UserLoginAttemptsRepository extends TimeStampRepositoryMixin<
  UserLoginAttempts,
  typeof UserLoginAttempts.prototype.id,
  Constructor<DefaultCrudRepository<
    UserLoginAttempts,
    typeof UserLoginAttempts.prototype.id>
  >
>(DefaultCrudRepository) {

  public readonly user: BelongsToAccessor<
    User,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
    @repository.getter('UserRepository') protected readonly userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserLoginAttempts, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );

    this.registerInclusionResolver('user',
      this.user.inclusionResolver
    );
  }
}
