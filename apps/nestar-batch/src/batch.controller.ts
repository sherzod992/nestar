import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import {
  BATCH_ROLLBACK,
  BATCH_TOP_AGENTS,
  BATCH_TOP_PROPERTIES
} from './lib/config';

@Controller()
export class BatchController {
  private logger: Logger = new Logger('BatchController');

  constructor(private readonly BatchService: BatchService) {}

  @Timeout(1000)
  handleTimeout() {
    this.logger.debug('BATCH SERVER READY');
  }

  // Har kuni soat 00:00 da ishga tushadi
  @Cron('0 0 * * *', { name: BATCH_ROLLBACK })
  public async batchRolBack() {
    try {
      this.logger.debug['context'] = BATCH_ROLLBACK;
      this.logger.debug('EXECUTED');
      await this.BatchService.batchRolBack();
    } catch (err) {
      this.logger.error(err);
    }
  }

  // Har kuni soat 00:20 da ishga tushadi
  @Cron('20 0 * * *', { name: BATCH_TOP_PROPERTIES })
  public async batchProperties() {
    try {
      this.logger.debug['context'] = BATCH_TOP_PROPERTIES;
      this.logger.debug('EXECUTED');
      await this.BatchService.batchTopProperties();
    } catch (err) {
      this.logger.error(err);
    }
  }

  // Har kuni soat 00:40 da ishga tushadi
  @Cron('40 0 * * *', { name: BATCH_TOP_AGENTS })
  public async batchAgents() {
    try {
      this.logger.debug['context'] = BATCH_TOP_AGENTS;
      this.logger.debug('EXECUTED');
      await this.BatchService.batchTopAgents();
    } catch (err) {
      this.logger.error(err);
    }
  }

  // Har 100 soniyada bir marta ishlaydi (log yozish uchun test)
  @Interval(100000)
  handleInterval() {
    this.logger.debug('INTERNAL TEST');
  }

  @Get()
  getHello(): string {
    return this.BatchService.getHello();
  }
}
