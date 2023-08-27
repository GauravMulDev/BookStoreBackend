import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  author: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  filePath: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
