import { BaseModel } from './index';

export interface IStore {
  id: string
  name: string
}

export class Store extends BaseModel<IStore> {
  constructor() {
    super(['stores']);
  }
}