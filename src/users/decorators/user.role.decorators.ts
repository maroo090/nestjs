/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { UserEnum } from "src/utils/enums";

export const Roles = (...roles: UserEnum[]) => {
    return SetMetadata('roles', roles)
}