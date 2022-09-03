import { Test, TestingModule } from '@nestjs/testing';
import { StoreManagerService } from './store-manager.service';

describe('StoreManagerService', () => {
  let service: StoreManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreManagerService],
    }).compile();

    service = module.get<StoreManagerService>(StoreManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
