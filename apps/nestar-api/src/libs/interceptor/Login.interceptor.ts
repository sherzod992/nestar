import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const recordTime = Date.now();
    const requestType = context.getType<GqlContextType>();
    this.logger.log(`Type: ${requestType}`, 'REQUEST');

    if (requestType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const req = gqlContext.getContext()?.req;

      try {
        // Safe logging of GraphQL request body
        this.logger.log(
          `GraphQL Body: ${this.safeStringify(req?.body)}`,
          'REQUEST',
        );
      } catch (err) {
        this.logger.warn('Failed to stringify request body', err);
      }

      return next.handle().pipe(
        tap((res) => {
          const responseTime = Date.now() - recordTime;
          this.logger.log(
            `GraphQL Response: ${this.safeStringify(res)} - ${responseTime}ms`,
            'RESPONSE',
          );
        }),
      );
    }

    // Return normally for HTTP or other types
    return next.handle();
  }

  private safeStringify(obj: any): string {
    const seen = new WeakSet();
    return JSON.stringify(
      obj,
      function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
        }
        return value;
      },
      2,
    ).slice(0, 1000); // Limit to 1000 chars to avoid log overflow
  }
}
