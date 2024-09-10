import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import * as momentjs from "moment";

export type CategoryDocument = HydratedDocument<string>;
  
@Schema()
export class Category {
    _id?: Types.ObjectId;
    @Prop()
    createdBy:string;
    @Prop({unique: true})
    text: string;
    @Prop({default: momentjs(new Date()).format('YYYY-MM-DD HH:mm:ss')})
    added: Date;
}



export const CategorySchema = SchemaFactory.createForClass(Category);