import { ObjectId } from "mongoose";

export class UserOutDto {
    constructor (public userId: any,
    public username: string,
    public isAdmin: boolean,
    public name: string,
    public token: string,) {}
}