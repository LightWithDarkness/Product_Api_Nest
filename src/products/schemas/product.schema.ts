import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Product {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    price: number;

    // a userId field to associate a product with a user
    @Prop({required: true})
    userId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);