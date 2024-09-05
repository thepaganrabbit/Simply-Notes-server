export default class IntUserDto {
  constructor(
    public username: string,
    public name: string,
    public userId: string,
    public isAdmin: boolean,
  ) {}
}
