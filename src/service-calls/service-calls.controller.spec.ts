import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCallsController } from './service-calls.controller';
import { ServiceCallsService } from './service-calls.service';

describe('ServiceCallsController', () => {
  let controller: ServiceCallsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceCallsController],
      providers: [ServiceCallsService],
    }).compile();

    controller = module.get<ServiceCallsController>(ServiceCallsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
