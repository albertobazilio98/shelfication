import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../db/firebase';

interface IBaseEntity {
  id: string
}

export abstract class BaseModel<EntityType extends IBaseEntity> {

  constructor(protected path: [string, ...string[]]) {}

  async fetch(): Promise<EntityType[]> {
    const snapshot = await getDocs(collection(db, ...this.path));

    const entities: EntityType[] = [];

    snapshot.forEach((doc) => {
      entities.push({
        id: doc.id,
        ...doc.data(),
      } as EntityType);
    });

    return entities;
  }

  async fetchById(id: string): Promise<EntityType> {
    const snapshot = await getDoc(doc(db, ...this.path, id));

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as EntityType;
  }

  async create(data: Omit<EntityType, 'id'>): Promise<EntityType> {
    const ref = await addDoc(collection(db, ...this.path), data);

    const result = {
      ...data,
      id: ref.id,
    } as EntityType;

    return result;
  }

  async update(data: Partial<EntityType> & { id: string }): Promise<void> {
    const { id, ...updateData } = data;
    await updateDoc(doc(db, ...this.path, id), updateData);
  }
}