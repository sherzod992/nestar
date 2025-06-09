
import { Injectable, NestInterceptor, ExecutionContext, CallHandler,Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger:Logger = new Logger()


  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const recordTime = Date.now();
    const requestType = context.getType<GqlContextType>();
    console.log(`Tyope ${requestType}`, "REQUEST");


    if(requestType === "http"){
        //Develop id needed
    }else if (requestType === "graphql"){
         const gqlContext = GqlExecutionContext.create(context);
         console.log("gqlContext =>",gqlContext);
         this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`,"REQUEST");


    return next.handle().pipe(
        tap(()=>{
                const responceTime = Date.now()-recordTime;
                this.logger.log(`${this.stringify(context)}-${responceTime}ms \n\n`, "RESPONCE")
            }),
        );

    }
    //Observable<any> errorni yoqotish uchun
    return next.handle()
  }
  private stringify(context:ExecutionContext):string{
    return JSON.stringify(context).slice(0,75);
  }
}
