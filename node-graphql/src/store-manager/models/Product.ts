import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType({description: 'product'})
export class Product {
    @Field({ nullable: false })
    id: number;

    @Field({ nullable: false })
    name: string;

    @Field({ nullable: false })
    color: string;
    
    @Field({ nullable: false })
    price: string;
    
    @Field({ nullable: false })
    category_id: string;
}