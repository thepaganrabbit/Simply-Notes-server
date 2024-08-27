import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DictionaryItem } from 'src/models/Dictionary';
import { Task } from 'src/models/Task';
import { CustomResponse, InTask } from 'src/types';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(DictionaryItem.name)
    private dictionaryModel: Model<DictionaryItem>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}
  async getWords(): Promise<CustomResponse<DictionaryItem[]>> {
    try {
      const items = await this.dictionaryModel.find({});
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
}
