import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
    _id?: Types.ObjectId;
    @Prop()
    text: string;
    @Prop({default: 'General'})
    category: string;
    @Prop({default: false})
    completed: boolean;
    @Prop()
    userId: string;
}



export const TaskSchema = SchemaFactory.createForClass(Task);