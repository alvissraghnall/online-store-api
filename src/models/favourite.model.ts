import {User} from '@loopback/authentication-jwt';
import {model, belongsTo} from '@loopback/repository';
import {EntityWithIdAndTimestamps} from './entity-with-id-and-timestamps.model';
import {Product} from './product.model';



@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Favourite extends EntityWithIdAndTimestamps {

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => Product)
  productId: string;

  constructor(data?: Partial<Favourite>) {
    super(data);
  }
}
