import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DictionaryItem, DictionarySchema } from 'src/models/Dictionary';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: DictionaryItem.name, schema: DictionarySchema }]), JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      global: true, 
      secret: configService.get<string>('jwtSecret'),
      signOptions: { expiresIn: '5m' },
    }),
    inject: [ConfigService],
  }),],
  controllers: [ContentController],
  providers: [ContentService]
})
export class ContentModule {}
