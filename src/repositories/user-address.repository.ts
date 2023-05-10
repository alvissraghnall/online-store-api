import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {UserAddress, UserAddressRelations} from '../models';

export class UserAddressRepository extends DefaultCrudRepository<
  UserAddress,
  typeof UserAddress.prototype.id,
  UserAddressRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(UserAddress, dataSource);
  }
}
