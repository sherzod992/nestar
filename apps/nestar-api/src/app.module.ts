import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {GraphQLModule} from '@nestjs/graphql';
import{ ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';

//decoretor 
@Module({
  imports: [ // import property
    ConfigModule.forRoot({ isGlobal: true }), 
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      uploads: false,
      autoSchemaFile: true,
      formatError:(error:T)=>{
        console.log("error",error);
        const graphQLFormattedError = {
          code: error?.extensions.code,
          message:
            error?.extensions?.extensions?.message || error?.extensions?.responce?.message||error?.message,
        }
      console.log("GRAPHQL GLOBAL ERROR",graphQLFormattedError)
      return graphQLFormattedError
      }
    }),
    ComponentsModule,//http
    DatabaseModule, SocketModule, //tcp
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],//property
})
export class AppModule {}
//ingrident *-
