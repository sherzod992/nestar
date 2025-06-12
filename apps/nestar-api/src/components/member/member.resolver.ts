import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput} from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';




@Resolver()
export class MemberResolver {

    //DI 
    constructor(private readonly memberService:MemberService){}
    
    @Mutation(()=>Member)
    public async signup(@Args('input')input:MemberInput):Promise<Member>{
            console.log('Mutation: signup');
            console.log("input",input)
            return this.memberService.signup(input);

    }

    @Mutation(()=>Member)
    public async login(@Args('input')input:LoginInput):Promise<Member>{
            console.log('Mutation: login');
            return this.memberService.login(input);

    }

	@UseGuards(AuthGuard)
	@Mutation(() => Member)
	public async updateMember(
		@Args('input') input: MemberUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Member> {
		console.log('Mutation: updateMember');
		delete input._id;
		console.log(typeof memberId);
		console.log('memberId:', memberId);
		return await this.memberService.updateMember(memberId, input);
	}

    @UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');
		console.log('memberNick:', memberNick);
		return `Hi  ${memberNick}`;
	}

    @Roles(MemberType.USER, MemberType.AGENT)
	@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
		console.log('Query: checkAuthRoles');
		return `Hi  ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
	}
    
	@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuthAdmin(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');
		console.log('memberNick:', memberNick);
		return `Hi  ${memberNick}`;
	}
	@UseGuards(WithoutGuard)
	@Query(() => Member)
	public async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('Query: getMember');
		console.log('memberId:', memberId);
		const targetId = shapeIntoMongoObjectId(input);
		return await this.memberService.getMember(memberId, targetId);
	}
    	// ADMIN MANAGEMENT:Admin//
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)

	public async getAllMembersByAdmin(): Promise<string> {
		console.log('Query: getAllMembersByAdmin');
		return this.memberService.getAllMemberByAdmin();
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Member)
	public async updateMemberByAdmin(): Promise<string> {
		return await this.memberService.updateMemberByAdmin();
	}
}
