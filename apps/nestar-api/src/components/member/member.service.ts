import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { T } from '../../libs/types/common';
@Injectable()
export class MemberService {

    constructor(@InjectModel("Member")private readonly memberModel:Model<Member>, 
    private authService:AuthService){}

    public async signup(input:MemberInput): Promise<Member> {
      input.memberPassword= await this.authService.hashPassword(input.memberPassword)
        try{
            const result = await this.memberModel.create(input);
            result.accessToken = await this.authService.createToken(result)
            return result;
        }catch(err){
            console.log("Error, Signup Model",err.message);
            throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE)
        }

    }
    public async login(input: LoginInput): Promise<Member> {
        try {
          const response = await this.memberModel
            .findOne({ memberNick: input.memberNick })
            .select('+memberPassword')
            .exec();
      
          if (!response || response.memberStatus === MemberStatus.DELATE) {
            throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
          } else if (response.memberStatus === MemberStatus.BLOCK) {
            throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
          }
          const isMatch = await this.authService.comparePassword(input.memberPassword, response.memberPassword!);
          if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);
          response.accessToken = await this.authService.createToken(response)
          return response; 
        } catch (err) {
          console.log("Error, Login Model", err);
          throw new BadRequestException(err);
        }
      }
      public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member> {
        const result = await this.memberModel
            .findOneAndUpdate(
                { _id: memberId, memberStatus: MemberStatus.ACTIVE },
                input,
                { new: true }
            )
            .exec();
    
        if (!result) {
            throw new InternalServerErrorException(Message.UPDATE_FAILED);
        }
    
        // 타입 단언을 사용하여 `result`를 `Member`로 변환
        const updatedMember = result as Member;
    
        updatedMember.accessToken = await this.authService.createToken(updatedMember);
        return updatedMember;
    }
    public async getMember(memberId: ObjectId, targetId: ObjectId): Promise<Member> {
      const search: T = {
        _id: targetId,
        memberStatus: {
          $in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
        },
      };
      const targetMember = await this.memberModel.findOne(search).lean().exec();
      if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
      return targetMember;
    }
    
    public async getAllMemberByAdmin():Promise<string>{
      return 'update admin executed';
    }
    public async updateMemberByAdmin():Promise<string>{
      return 'update admin executed';
    }
}
