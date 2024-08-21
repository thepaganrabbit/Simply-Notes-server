import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import {v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    _id?: Types.ObjectId;
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