import { Injectable } from '@nestjs/common';
import { Auth } from './auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
  ) {}
  async create({
    userId,
    password,
  }: {
    userId: Types.ObjectId;
    password: string;
  }) {
    return this.authModel.create({
      userId: userId,
      password: await hash(password),
    });
  }

  async verify({
    userId,
    password,
  }: {
    userId: Types.ObjectId;
    password: string;
  }) {
    const auth = await this.authModel.findOne({ userId: userId }).lean();
    return await verify(auth.password, password);
  }
}
