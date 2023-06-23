import {authenticate, TokenService, UserService} from '@loopback/authentication';
import {
  User as JwtAuthUser,
  TokenServiceBindings,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject, service} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  response,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Cart, User} from '../models';
import {CartRepository, UserRepository} from '../repositories';
// import {genSalt, hash} from 'bcryptjs';
import {Credentials} from "../repositories";
import {AuthService, BCryptService, CartService} from '../services';

const UserSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const RequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: UserSchema},
  },
};

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    // @repository(UserRepository)
    // public userRepository : UserRepository,
    // @inject(UserServiceBindings.USER_SERVICE)
    // public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    // @repository(JwtAuthUserRepository) protected userRepository: JwtAuthUserRepository,
    // @inject(PasswordHasherBindings.PASSWORD_HASHER)
    // public passwordHasher: PasswordHasher,
    @service(BCryptService) public bcryptService: BCryptService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @service(AuthService)
    public authService: AuthService,

  ) { }

  @post('/signup')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'roles', 'createdAt', 'updatedAt'],
          }),
        },
      }, required: true
    })
    user: Omit<User, 'id'>,
  ): Promise<JwtAuthUser> {
    console.log(user);
    user.roles = ['customer']
    try {
      const newUser = await this.authService.createUser(
        user as User
      );
      // console.log(newUser);
      return newUser;
    } catch (error) {
      if (error.code === 11000 && error.message.includes('index: email')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw new HttpErrors.InternalServerError(error.message);
      }
    }
  }

  @post('/signin', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async signIn(
    @requestBody(RequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.authService.verifyCredentials(credentials);
    const userProfile = this.authService.convertToUserProfile(user);
    console.log("User profile: ", userProfile);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoami', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    loggedInUserProfile: UserProfile,
  ): Promise<string> {
    return loggedInUserProfile[securityId];
  }
}
