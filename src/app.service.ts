import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  checkIn() {
    return {
      payload: true,
      success: true,
      code: 200
    }
  }
}
