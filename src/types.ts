import { Request } from "@nestjs/common"
import { User } from "./models/User.model"
import { UserOutDto } from "./dtos/UserOut.dto";

export interface CustomRequest extends Request {
    isAdmin?: boolean | undefined;
    user?: UserOutDto |  undefined;
}

export type LoginObj = {
    username: string;
    password: string;
}

export interface CustomResponse <T> {
    payload: T,
    success: boolean;
    code: number;
    message?: string;
    error?: Error | any;
}

export interface InTask {
    text: string;
    userId:string;
}