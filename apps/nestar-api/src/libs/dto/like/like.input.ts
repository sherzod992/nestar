import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
import { LikeGroup } from '../../enums/like.enum';

@InputType()
export class LikeInput { 
	//Kim 
	@IsNotEmpty()
	@Field(() => String)
	memberId: ObjectId;
	//qaysi targetni like qilmoqchi
	@IsNotEmpty()
	@Field(() => String)
	likeRefId: ObjectId;
	//qaysi like guruhiga tegishli
	@IsNotEmpty()
	@Field(() => LikeGroup)
	likeGroup: LikeGroup;
}
