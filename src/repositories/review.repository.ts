import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp.mixin';
import {Review, ReviewRelations} from '../models';

export class ReviewRepository extends TimeStampRepositoryMixin<
  Review,
  typeof Review.prototype.id,
  Constructor<DefaultCrudRepository<Review, typeof Review.prototype.id, ReviewRelations>>
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Review, dataSource);
  }
}
