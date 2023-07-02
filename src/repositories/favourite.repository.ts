import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Favourite} from '../models';

export class FavouriteRepository extends DefaultCrudRepository<
  Favourite,
  typeof Favourite.prototype.id

> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Favourite, dataSource);
  }
}
