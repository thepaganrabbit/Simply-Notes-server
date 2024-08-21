import { ObjectId } from "mongoose";

export class UserOutDto {
    constructor (public userId: any,
    public username: string,
    public name: string,
    public token: string,) {}
}