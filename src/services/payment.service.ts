
import { /* inject, */ BindingScope, inject, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import axios from 'axios';
import {CartItem, OrderStatus} from '../models';
import {UserRepository} from '../repositories/user.repository';
import {PaystackTxnInitResponse, PaystackTxnVerifyResponse, omit} from '../util';
import {CartService} from './cart.service';
import {OrderService} from './order.service';
// import { merge } from 'lodash';

type PaystackParams = {
  email: string, amount: number,
  currency?: 'NGN' | 'GHS' | 'ZAR' | 'USD',
  channels?: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  metadata?: Record<string, unknown>,
  callback_url?: string,
  // onClose?: () => any
}

// response: {reference: string, access_code: string, authorization_url: string}

@injectable({scope: BindingScope.TRANSIENT})
export class PaymentService {

  private axiosInstance = axios.create(
    {
      baseURL: 'https://api.paystack.co/transaction',
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

  ) { }

  async makePayment(body: {amount: number, passedEmail?: string, items: CartItem[]}) {
    // const currUser = await this.userRepository.findById(
    //   this.loggedInUserProfile[securityId]
    // );
    // const cart = await this.cartService.findByUser(this.loggedInUserProfile, false);
    const amount = Math.round(body.items.reduce(
      (acc, curr) => acc += (curr.product.price * curr.quantity),
      0
    ) * 777 * 100);  // 777 -> exchange rate; multiplying by 100 to get value in kobos.
    console.log(amount);
    const data: PaystackParams = {
      email: body.passedEmail ?? this.loggedInUserProfile.email!,
      amount,
      currency: "NGN",
      callback_url: 'http://localhost:5173/payment-success',
      metadata: {
        // products: JSON.stringify(body.items)
        custom_fields: [
          {
            display_name: 'name',
            variable_name: 'name',
            value: this.loggedInUserProfile.name
          }, {
            display_name: 'email',
            variable_name: 'email',
            value: this.loggedInUserProfile.email
          },
        ]
      }
    }

    const res = await this.axiosInstance.post<PaystackTxnInitResponse>(
      "/initialize",
      data,
    ).catch(
      err => {
        console.log(err.response.data ?? err.request);
        throw new HttpErrors[503]("Something went wrong from our end.")
      }
    );
    console.log(res);

    if (res.data.status === true) {

      const newOrder = {
        products: body.items.map(
          item => item = omit<Pick<CartItem, keyof CartItem>>(item, ['product'])
        ),
        reference: res.data.data.reference,
        access_code: res.data.data.access_code
      }

      // newOrder.products.map(
      //   item => item = omit<Pick<CartItem, keyof CartItem>>(item, ['product'])
      // );
      console.log(newOrder.products);

      await this.orderService.create(newOrder, this.loggedInUserProfile);

      // omit(res.data.data, ['reference']);

      return res.data;
    } else {
      return HttpErrors.InternalServerError("Failed for some reason!")
    }
  }

  async verifyPayment(reference: string) {

    const res = await this.axiosInstance.get<PaystackTxnVerifyResponse>(
      `/verify/${reference}`,
    ).catch(
      err => {
        if (err.response.data.message.includes('reference not found')) {
          throw new HttpErrors[404](err.response.data.message);
        }
        console.log(err.response.data);
        throw new HttpErrors[503]("Something went wrong from our end.")
      }
    );

    console.log(res.data);

    if (res.data.status === true) {

      const order = await this.orderService.findOne({
        where: {
          reference
        }
      });

      if (!order) throw new HttpErrors.InternalServerError();

      if (res.data.data.status === 'success') {
        order.status = OrderStatus.PROCESSING;
      } else {
        order.status = OrderStatus.CANCELLED;
      }

      return await this.orderService.save(order);
    } else {
      throw new HttpErrors.NotFound("Transaction with reference provided not found");
    }
  }

}
