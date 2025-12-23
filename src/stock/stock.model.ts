import { Collection, ObjectId } from 'mongodb';
import { connectClient, getDb } from '../db.client';
import { StockDocument } from './schemas/stock.schema';

export class StockModel {
  static collectionName = 'stocks';

  private static async collection(): Promise<Collection> {
    try {
      const { db } = await connectClient();
      return db.collection(this.collectionName);
    } catch (err) {
      return getDb().collection(this.collectionName);
    }
  }

  static async findAllWithBook(): Promise<any[]> {
    const coll = await this.collection();
    // use lookup with pipeline to safely match string bookId -> ObjectId
    const pipeline = [
      {
        $lookup: {
          from: 'books',
          let: { bookIdStr: '$bookId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$bookIdStr' }],
                },
              },
            },
            { $project: { title: 1, isbn: 1 } },
          ],
          as: 'book',
        },
      },
      { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
    ];
    return coll.aggregate(pipeline).toArray();
  }

  static async findByIdWithBook(id: string): Promise<any> {
    const coll = await this.collection();
    const _id = new ObjectId(id);
    const doc = await coll.findOne({ _id });
    if (!doc) return null;
    // fetch related book
    try {
      const booksColl = (await connectClient()).db.collection('books');
      let book: any = null;
      if (doc.bookId) {
        try {
          const bookId = typeof doc.bookId === 'string' ? new ObjectId(doc.bookId) : doc.bookId;
          book = await booksColl.findOne({ _id: bookId }, { projection: { title: 1, isbn: 1, coverUrl: 1, author: 1, description: 1 } });
        } catch {
          // ignore
        }
      }
      return { stock: doc, book };
    } catch {
      return { stock: doc };
    }
  }

  static async create(doc: StockDocument) {
    const coll = await this.collection();
    const res = await coll.insertOne(doc as any);
    return res.insertedId;
  }
}
