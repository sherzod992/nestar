import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { LikeService } from './like.service';
import LikeSchema from "../../schemas/Like.model";

@Module({
  // imports property skima modeli keladi
  imports: [MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }]),],


  // like resolver kerak bolmedi servicelar orqali ishlaymiz
  // har biri alohidadan  ozini ichiga tashkillashtramiz property, member,
  providers: [LikeService],
  // like modelni tashqariga export qilamiz
  exports:[LikeService]
})
export class LikeModule {}
