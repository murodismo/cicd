import { Controller, Get, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':userId/:productId')
  async likeOrUnlike(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.likeService.likeOrUnlikeProduct(userId, productId);
  }

  @Get(':userId')
  async getLikedProducts(@Param('userId') userId: string) {
    return this.likeService.getLikedProducts(userId);
  }
}
