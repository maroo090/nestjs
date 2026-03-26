/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedRequest } from "src/utils/types";


export const UserDecorator = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
        const payload = request.user
        return payload
    }
)