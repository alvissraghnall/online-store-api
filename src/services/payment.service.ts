
import {injectable, /* inject, */ BindingScope, service, inject} from '@loopback/core';
import {Filter, ObjectType, repository} from '@loopback/repository';
import {FavouriteRepository, ProductRepository} from '../repositories';
import {CartItem, Order, Product, User} from '../models';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories/user.repository';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {OrderService} from './order.service';
import axios from 'axios';
import {CartService} from './cart.service';
import {PaystackTxnInitResponse} from '../util/types/payment.types';
import {omit} from '../util';
// import { merge } from 'lodash';

type PaystackParams = {
  email: string, amount: number,
  currency?: 'NGN' | 'GHS' | 'ZAR' | 'USD',
  channels?: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  metadata?: unknown[] | { [x: string]: unknown },
  callback_url?: string,
  // onClose?: () => any
}

// response: {reference: string, access_code: string, authorization_url: string}

@injectable({scope: BindingScope.TRANSIENT})
export class PaymentService {

  private axiosInstance = axios.create(
    {
      baseURL: 'https://api.paystack.co',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
        'Content-Type': 'application/json'
      }
    }
  )

  constructor(
    @service(OrderService) private readonly orderService: OrderService,
    @service(CartService) private readonly cartService: CartService,
    @inject(SecurityBindings.USER) private loggedInUserProfile: UserProfile,
    @repository(UserRepository) private readonly userRepository: UserRepository,

  ) {}

  async makePayment (body: {amount: number, passedEmail?: string, items: CartItem[]}) {
    const currUser = await this.userRepository.findById(
      this.loggedInUserProfile[securityId]
    );
    // const cart = await this.cartService.findByUser(this.loggedInUserProfile, false);
    const amount = Math.round(body.items.reduce(
      (acc, curr) => acc += (curr.product.price * curr.quantity),
      0
    ) * 777 * 100);  // 777 -> exchange rate; multiplying by 100 to get value in kobos.
    console.log(amount);
    const data: PaystackParams = {
      email: body.passedEmail ?? currUser.email,
      amount,
      currency: "NGN",
      callback_url: 'http://localhost:5173/payment-success',
      metadata: {
        products: JSON.stringify(body.items)
      }
    }

    const res = await this.axiosInstance.post<PaystackTxnInitResponse>(
      "/transaction/initialize",
      data,
    ).catch(
      err => {
        console.log(err.response.data);
        throw new HttpErrors[503]("Something went wrong from our end.")
      }
    );
    console.log(res);

    if (res.data.status === true) {

      const newOrder = {
        products: body.items,
        reference: res.data.data.reference,
        access_code: res.data.data.access_code
      }

      for (let item of newOrder.products) {
        item = omit<Pick<CartItem, keyof CartItem>>(item, ['product'])
      }

      await this.orderService.create(newOrder, this.loggedInUserProfile);

      // omit(res.data.data, ['reference']);

      return res.data;
    } else {
      return HttpErrors.InternalServerError("Failed for some reason!")
    }
  }

}
