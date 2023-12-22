import { BaseModel } from './index';
import { IStore } from './store';

export class UserStore extends BaseModel<IStore> {
  constructor(
    private uid: string,
  ) {
    super(['users', uid, 'stores']);
  }
}