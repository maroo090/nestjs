/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { map, Observable } from 'rxjs';
import { UserType } from "../types";
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {

        return next.handle().pipe(map((data: UserType) => {
            if (!data) return data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...rest } = data
            return { ...rest }
        },
        ));
    }
}
