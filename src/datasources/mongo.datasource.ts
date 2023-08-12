import {inject, lifeCycleObserver, ValueOrPromise} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';

const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=8000',
  host: '127.0.0.1',
  port: 27017,
  user: '',
  password: '',
  database: 'osa',
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const productionConfig = {
  name: 'mongo',
  connector: 'mongodb',
  url: process.env.SHOPPING_APP_MONGO_URI,
  database: process.env.SHOPPING_APP_MONGO_DB,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

function updateConfig(dsConfig: AnyObject) {
  if (process.env.KUBERNETES_SERVICE_HOST) {
    // dsConfig.host = process.env.SHOPPING_APP_MONGODB_SERVICE_HOST;
    dsConfig.url = process.env.SHOPPING_APP_MONGO_URI;
    // dsConfig.port = +process.env.SHOPPING_APP_MONGODB_SERVICE_PORT!;
  }
  return dsConfig;
}

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource {
  static readonly dataSourceName = config.name;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: AnyObject = process.env.NODE_ENV === "production" ? productionConfig : config,
  ) {
    super(updateConfig(dsConfig));
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
