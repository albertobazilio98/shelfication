import { BaseModel } from './index';

export interface IVolumeModel {
  id: string
  index: number
  obtained: boolean
  storeItems: IStoreItem[]
}

export interface IStoreItem {
  store: string
  link?: string
  price?: number
}

export class Volume extends BaseModel<IVolumeModel> {
  constructor(
    private uid: string,
    private collectionId: string,
  ) {
    super(['users', uid, 'collections', collectionId, 'volumes']);
  }
}