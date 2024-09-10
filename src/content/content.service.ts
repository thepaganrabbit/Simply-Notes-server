import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtCategorysDto } from 'src/dtos/ExtCatagoryDto';
import { Category } from 'src/models/Category';
import { DictionaryItem } from 'src/models/Dictionary';
import { Task } from 'src/models/Task';
import { CustomResponse, InTask, StandardCategory } from 'src/types';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(DictionaryItem.name)
    private dictionaryModel: Model<DictionaryItem>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async getWords(): Promise<CustomResponse<DictionaryItem[]>> {
    try {
      let items = await this.dictionaryModel.find({});
      if (!items || items.length <= 0) {
        items = [];
      } else {
        items = items.sort((a, b) => a.commonality - b.commonality);
      }
      return {
        code: 200,
        payload: items,
        success: true,
        message:
          items.length <= 0
            ? 'No words in dictionary...'
            : 'Successful retrieval of words.',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }
  async getTasks(): Promise<CustomResponse<Task[]>> {
    try {
      const items = await this.taskModel.find({});
      return {
        code: 200,
        payload: items,
        success: true,
        message:
          items.length <= 0
            ? 'You have no tasks...'
            : 'Successful retrieval of tasks.',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }

  async getCategories(admin: boolean): Promise<CustomResponse<Category[]>> {
    try {
      let categories = [];
      if (admin) {
        categories = await this.categoryModel.find<Category>({});
      } else {
        categories = (await this.categoryModel.find<StandardCategory>({})).map(
          (category) => {
            return {
              _id: category._id,
              text: category.text,
            };
          },
        );
      }
      return {
        code: 200,
        payload: categories,
        success: true,
        message:
          categories.length <= 0
            ? 'There are no categories...'
            : 'Successful retrieval of categories.',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }

  async addNewCategory(
    extCategory: ExtCategorysDto,
  ): Promise<CustomResponse<Category[]>> {
    try {
      const category = new this.categoryModel({
        text: extCategory.text,
        createdBy: extCategory.createdBY,
      });

      await category.save();
      const allCategories = await this.categoryModel.find<Category>({});
      return {
        code: 200,
        payload: allCategories,
        success: true,
        message: 'Successfully added category.',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }
  async addTask(task: InTask): Promise<CustomResponse<Task[]>> {
    try {
      // see if an active task exists in the list
      const containsTask = await this.taskModel
        .find<Task>({ text: task.text })
        .where('completed')
        .equals(true);
      if (containsTask.length > 0) {
        const allTasks = await this.taskModel.find<Task>({});
        return {
          code: 200,
          payload: allTasks,
          success: true,
          message: 'Task already exists',
        };
      }

      const newTask = new this.taskModel(task);
      await newTask.save();
      const tasks = await this.taskModel.find<Task>({});
      const exists = await this.dictionaryModel.findOne<DictionaryItem>({
        text: task.text,
      });
      if (exists) {
        const upgradeCommonality = exists.commonality + 1;
        await this.dictionaryModel.updateOne(
          { _id: exists._id },
          { commonality: upgradeCommonality },
        );
      } else {
        const newDictInstance = new this.dictionaryModel({
          text: newTask.text,
        });
        await newDictInstance.save();
      }
      return {
        code: 200,
        payload: tasks,
        success: true,
        message: 'Successfully added task',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }
  async taskStateChanged(id: string): Promise<CustomResponse<Task[]>> {
    try {
      const task = await this.taskModel.findOne<Task>({ _id: id });
      if (!task) throw new BadRequestException();
      const updatedTask = await this.taskModel.updateOne<Task>(
        { _id: id },
        { completed: task.completed ? false : true },
      );
      if (!updatedTask.acknowledged) throw new BadRequestException();
      const tasks = await this.taskModel.find({});
      return {
        code: 200,
        payload: tasks,
        success: true,
        message: 'Successfully updated task',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }

  async deleteTask(id: string): Promise<CustomResponse<Task[]>> {
    try {
      const task = await this.taskModel.deleteOne({ _id: id });
      if (!task.acknowledged) throw new BadRequestException();
      const tasks = await this.taskModel.find({});
      return {
        code: 200,
        payload: tasks,
        success: true,
        message: 'Successfully deleted task',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }
  async deleteACategory(id: string): Promise<CustomResponse<number>> {
    try {
      const category = await this.categoryModel.deleteOne({ _id: id });
      if (!category.acknowledged) throw new BadRequestException();
      return {
        code: 204,
        payload: 204,
        success: true,
        message: 'Successfully deleted task',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }
  async deleteAWord(id: string): Promise<CustomResponse<number>> {
    try {
      const word = await this.dictionaryModel.deleteOne({ _id: id });
      if (!word.acknowledged) throw new BadRequestException();
      return {
        code: 204,
        payload: 204,
        success: true,
        message: 'Successfully deleted task',
      };
    } catch (error) {
      return {
        payload: null,
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
      };
    }
  }
}
