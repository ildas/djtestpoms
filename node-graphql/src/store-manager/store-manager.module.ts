import { Module } from '@nestjs/common';
import { StoreManagerService } from './store-manager.service';
import { StoreManagerResolver } from './store-manager.resolver';

@Module({
  providers: [StoreManagerService, StoreManagerResolver]
})
export class StoreManagerModule {}
