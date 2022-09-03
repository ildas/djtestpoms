import { Query } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { Product } from './models/Product';
import { StoreManagerService } from './store-manager.service';

@Resolver()
export class StoreManagerResolver {
    constructor(private readonly storeManagerService: StoreManagerService) {}

    // @Query(() => Product[])
    // async getProducts() {
    //     const products = await this.storeManagerService.getProductsById()
    //     return products
    // }

    // @Query(() => String)
    // product(): string {
    //     return this.storeManagerService.sayHello()
    // }


    @Query('products')
    async getProducts() {
        return { Id: 14, Name: "Swimwear", Color: "Red", Price: 53.71, CategoryId: 7 } as unknown as Product
    }


}
