import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like, LikeDocument } from 'src/schema/like.schema';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}

  async likeOrUnlikeProduct(userId: string, productId: string) {
    let userLikes = await this.likeModel.findOne({ userId });

    const productObjectId = new Types.ObjectId(productId);

    if (!userLikes) {
      userLikes = new this.likeModel({
        userId,
        likedProducts: [productObjectId],
      });
      await userLikes.save();
      return { message: 'Product liked' };
    }

    const alreadyLiked = userLikes.likedProducts.some(
      (id) => id.toString() === productId, // ObjectId ni string qilib solishtirish kerak
    );

    if (alreadyLiked) {
      userLikes.likedProducts = userLikes.likedProducts.filter(
        (id) => id.toString() !== productId,
      );
    } else {
      userLikes.likedProducts.push(productObjectId);
    }

    await userLikes.save();

    return { message: alreadyLiked ? 'Product unliked' : 'Product liked' };
  }

  async getLikedProducts(userId: string) {
    const userLikes = await this.likeModel
      .findOne({ userId })
      .populate('likedProducts'); // Product ma'lumotlarini olish uchun populate qilamiz

    if (!userLikes) {
      return { likedProducts: [] };
    }

    return { likedProducts: userLikes.likedProducts };
  }
}
