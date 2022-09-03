import { Test, TestingModule } from '@nestjs/testing';
import { StoreManagerResolver } from './store-manager.resolver';

describe('StoreManagerResolver', () => {
  let resolver: StoreManagerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreManagerResolver],
    }).compile();

    resolver = module.get<StoreManagerResolver>(StoreManagerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
