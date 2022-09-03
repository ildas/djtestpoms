import { Injectable } from '@nestjs/common';
import { Product } from './models/Product';

@Injectable()
export class StoreManagerService {

    async getProductsById() {
        return [] as Product[]
    }

    sayHello() {
        return 'hello'
    }
}
