import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import {v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({required: false})
    _id?: string;
    @Prop({default: false})
    isAdmin: boolean;
    @Prop()
    name: string;
    @Prop({ unique: true })
    username: string;
    @Prop()
    password: string;
}



export const UserSchema = SchemaFactory.createForClass(User);