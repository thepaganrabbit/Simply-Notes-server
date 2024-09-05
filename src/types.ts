import { Request } from "@nestjs/common"
import IntUserDto from "./dtos/IntUser.dto";

export interface CustomRequest extends Request {
    user?: IntUserDto |  undefined;
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