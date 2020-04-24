import Mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

class MongoDbConnection {
  private URL: string = process.env.LOCAL_MONGO_URL || '';
  constructor() {
    this.connect();
  }
  private connect(): void {
    Mongoose.connect(this.URL, { useNewUrlParser: true, useUnifiedTopology: true });
    Mongoose.connection.on('connected', function () {
      console.log('mongodb connected successfully');
    });
    Mongoose.connection.on('error', function (error) {
      console.error('mongodb error', error);
    });
    Mongoose.connection.on('reconnected', function () {
      console.log('mongodb reconnected successfully');
    });
    Mongoose.connection.on('disconnected', function () {
      console.error('mongodb disconnected');
    });
  }
}
export default MongoDbConnection;
