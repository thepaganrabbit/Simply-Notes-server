import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type DictionaryItemDocument = HydratedDocument<string>;

@Schema()
export class DictionaryItem {
    _id?: Types.ObjectId;
    @Prop({default: 0})
    commonality: number;
    @Prop()
    text: string;
}



export const DictionarySchema = SchemaFactory.createForClass(DictionaryItem);