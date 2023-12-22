import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { BaseModel } from './index';
import { db } from '@/db/firebase';

export interface IcollectionModel {
  id: string
  name: string
  quantity: number
}

export class Collection extends BaseModel<IcollectionModel> {
  constructor(
    private uid: string,
  ) {
    super(['users', uid, 'collections']);
  }

  async progress(collectionId: string) {
    const volumesCollection = collection(db, ...this.path, collectionId, 'volumes');
    const volumesQuery = query(volumesCollection, where('obtained', '==', true));
    const obtainedCount = await getCountFromServer(volumesQuery);

    return obtainedCount.data().count;
  }
}