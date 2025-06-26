// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri:
          process.env.NODE_ENV === 'production'
            ? process.env.MONGO_URI
            : process.env.MONGO_URI_DEV,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {
  constructor(@InjectConnection() private readonly connection: Connection) {
    if (connection.readyState === 1) {
      console.log(
        `✅ MongoDB connected to ${
          process.env.NODE_ENV === 'production' ? 'production' : 'development'
        } database`,
      );
    } else {
      console.log('❌ MongoDB is not connected');
    }
  }
}
