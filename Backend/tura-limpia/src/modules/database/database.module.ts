import { Module } from '@nestjs/common';
import { TURADB } from './provider/turadb.js';

@Module({ providers: [TURADB], exports: [TURADB] })
export class DatabaseModule {}
