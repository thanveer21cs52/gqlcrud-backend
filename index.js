import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import schema from './entity/schema.js';
import { createServer } from 'http';
import {WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions'; 
import cors from 'cors'


const app = express();
app.use(cors())
export const pubsub = new PubSub();
const httpServer = createServer(app)
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
useServer({ schema }, wsServer);
const server = new ApolloServer({
  schema, 
});

await server.start();

app.use('/graphql', express.json(), expressMiddleware(server));

httpServer.listen(process.env.PORT, () => {
  console.log(`🚀 HTTP ready at http://localhost:${process.env.PORT}/graphql`);
  console.log(`🔄 Subscriptions ready at ws://localhost:${process.env.PORT}/graphql`);
});
