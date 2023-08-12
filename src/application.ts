import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
// import { AuthenticationComponent } from '@loopback/authentication';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {GraphQLBindings, GraphQLComponent} from '@loopback/graphql';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {sampleRecipes} from './sample-recipes';
import {MySequence} from './sequence';
import {MongoDataSource} from './datasources';
import {PasswordHasherBindings} from './util';
import crypto from 'crypto';
import {JWTService} from './services';

export {ApplicationConfig};

export class App extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.component(GraphQLComponent);
    this.component(JWTAuthenticationComponent);
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);
    this.dataSource(MongoDataSource, );

    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    // To register one or more middlewares as per https://typegraphql.com/docs/middlewares.html
    server.middleware(
      (resolver, next) => next()
    );

    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);

    // It's possible to register a graphql context resolver
    this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to(context => {
      return {...context};
    });
    this.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
      $data: true,
      validation: {
        $data: true,
        allErrors: true,
      }
    })

    this.bind('recipes').to([...sampleRecipes]);

    this.static('/', path.join(__dirname, '../public'));

    // this.configure(RestExplorerBindings.COMPONENT).to({
    //   path: '/explorer',
    // });
    // this.component(RestExplorerComponent);

    this.setupBindings();

    this.projectRoot = __dirname;

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      graphqlResolvers: {
        // Customize ControllerBooter Conventions here
        dirs: ['graphql-resolvers'],
        extensions: ['.resolver.js'],
        nested: true,
      },
      models: {
        dirs: ['models', 'graphql-types'],
        extensions: ['.input.js', '.model.js'],
        nested: true,
      },
      graphqlTypes: {
        dirs: ['models'],
        extensions: ['.model.js'],
        nested: true,
      }
    };

  }


  setupBindings (): void {
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    console.log("ENV: ", process.env.JWT_SECRET);
    console.log("ENV: ", process.env.NODE_ENV);
    const secret =
      process.env.JWT_SECRET ?? crypto.randomBytes(32).toString('hex');
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(secret);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to('864000');
  }
}
