import { Types } from 'mongoose';

export type withId = { _id: Types.ObjectId };

export type withIdAndTimeStamps = withId & {
  createdAt: string;
  updatedAt: string;
};
