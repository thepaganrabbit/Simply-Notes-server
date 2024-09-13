export class UpdateUserDto {
    constructor(
      public name: string,
      public username: string,
      public userId: string,
      public isAdmin: boolean,
      public password?: string | undefined,
    ) {}
  }
  