import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongodb_usuarios',
  connector: 'mongodb',
  url: 'mongodb+srv://prog_web:ProgWebMisionTIC2022@clusterprogweb.kucv3.mongodb.net/usuariosInmobiliariaDB?retryWrites=true&w=majority',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'usuariosInmobiliariaDB',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbUsuariosDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongodb_usuarios';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodb_usuarios', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}