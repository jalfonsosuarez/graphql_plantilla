import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import express, { Application } from 'express';
import { GraphQLSchema } from 'graphql';
import { createServer, Server } from 'http';

class GraphQLServer {
  // Propiedades
  private app!: Application;
  private httpServer!: Server;
  private readonly DEFAULT_PORT = 3025;
  private schema!: GraphQLSchema;

  constructor( schema?: GraphQLSchema ) {
    if ( !schema || schema === undefined ) {
        throw new Error( 'No se ha proporcionado el schema de GraphQL' );
    }
    this.schema = schema;
    this.init();
  }

  private init() {
    this.configExpress();
    this.configApolloServerExpress();
    this.configRoutes();
  }

  private configExpress() {
    this.app = express();
    this.app.use(compression());
    this.httpServer = createServer( this.app );
  }

  private async configApolloServerExpress() {

    const apolloServer = new ApolloServer({
      schema: this.schema,
      introspection: true,
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: this.app, cors: true });
  }

  private configRoutes() {
    this.app.get('/hello', (_, res) => {
        res.send('¡Hola mundo!');
      });
  
      this.app.get('/', (_, res) => {
        res.redirect('/graphql');
      });  
  }

  listen(callback: (port: number) => void): void {
    this.init();
    this.httpServer.listen(this.DEFAULT_PORT, () => {
      callback(this.DEFAULT_PORT);
    });
  }
}

export default GraphQLServer;
