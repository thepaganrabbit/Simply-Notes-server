import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DictionaryItem } from 'src/models/Dictionary';
import { CustomResponse } from 'src/types';

@Injectable()
export class ContentService {
    constructor(@InjectModel(DictionaryItem.name) private dictionaryModel: Model<DictionaryItem>,){}
    async getWords(): Promise<CustomResponse<DictionaryItem[]>> {
        try {
            const items = await this.dictionaryModel.find({});
            return {
                code: 200,
                payload: items,
                success: true,
                message: items.length <= 0 ? 'No words in dictionary...' : 'Successful retrieval of words.'
            };
        } catch (error) {
            return {
                payload: null,
                code: HttpStatus.BAD_REQUEST,
                success: false,
                message: error.message,
            }
        }
    }
}
