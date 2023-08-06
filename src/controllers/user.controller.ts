import {inject, service} from '@loopback/core';
import {UserService, basicAuthorization} from '../services';
import {getModelSchemaRef, requestBody, response} from '@loopback/openapi-v3';
import {User} from '../models';
import { put } from "@loopback/rest";
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';

export class UserController {

  constructor(
    @service(UserService)
    private userService: UserService,
    @inject(SecurityBindings.USER) private readonly loggedInUserProfile: UserProfile,
  ) { }


  @put('/users')
  @response(200, {
    description: 'User PUT success',
    content: {'application/json': {schema: getModelSchemaRef(User, {
      exclude: ["password"],
      includeRelations: false
    })}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async replaceById(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User),
        },
      },
    }) user: User,
  ): Promise<User> {
    return await this.userService.updateUser(this.loggedInUserProfile[securityId], user);
  }

}
