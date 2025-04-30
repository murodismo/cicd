import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { AddCommentDto } from './dto/add-comment.dto';

@ApiTags('Mahsulotlar')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Mahsulot rasmi yuklash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.productService.uploadImageToCloudinary(file);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi mahsulot yaratish' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Post(':id/comments')
  async addCommentToProduct(@Param('id') productId: string, @Body() addCommentDto: AddCommentDto) {
    const { userId, username, star, text } = addCommentDto;
    return this.productService.addComment(productId, userId, username, star, text);
  }


  @Get()
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.findAll(Number(page), Number(limit));
  }

  @Get('/filter')
  @ApiOperation({ summary: 'Filtrlar orqali mahsulotlarni topish' })
  @ApiQuery({ name: 'category', required: false, description: 'Mahsulot kategoriyasi' })
  @ApiQuery({ name: 'brand', required: false, description: 'Mahsulot brendi' })
  @ApiQuery({ name: 'screenType', required: false, description: 'Ekran turi' })
  @ApiQuery({ name: 'screenDiagonal', required: false, description: 'Ekran diagonali' })
  @ApiQuery({ name: 'protection', required: false, description: 'Ekran himoyasi' })
  @ApiQuery({ name: 'memory', required: false, description: 'Mahsulot xotirasi' })
  findByFilters(
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('screenType') screenType?: string,
    @Query('screenDiagonal') screenDiagonal?: string,
    @Query('protection') protection?: string,
    @Query('memory') memory?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.findByFilters(
      category,
      brand,
      screenType,
      screenDiagonal,
      protection,
      memory,
      Number(page),
      Number(limit),
    );
  }

  @Get('/search')
  @ApiOperation({ summary: 'Mahsulotlarni qidirish' })
  @ApiQuery({ name: 'query', required: true, description: 'Qidirilayotgan matn' })
  searchProducts(@Query('query') query: string) {
    return this.productService.searchProducts(query);
  }

  @Get('/filter_options')
  @ApiOperation({ summary: 'Barcha filtr variantlarini olish' })
  getAllFilterOptions() {
    return this.productService.getAllFilterOptions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID orqali mahsulotni olish' })
  @ApiParam({ name: 'id', required: true, description: 'Mahsulot IDsi' })
  findOne(@Param('id') id: string) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('Invalid ObjectId format');
    }
    return this.productService.findOne(id);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Mahsulotni yangilash' })
  @ApiParam({ name: 'id', required: true, description: 'Mahsulot IDsi' })
  @ApiBody({ type: UpdateProductDto })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Mahsulotni o\'chirish' })
  @ApiParam({ name: 'id', required: true, description: 'Mahsulot IDsi' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Patch('stock/:id')
  @ApiOperation({ summary: 'Xarid qilinganidan so\'ng mahsulot zaxirasini kamaytirish' })
  @ApiParam({ name: 'id', required: true, description: 'Mahsulot IDsi' })
  @ApiQuery({ name: 'orderNum', required: false, description: 'Nechta mahsulot xarid qilindi' })
  removeProductStock(
    @Param('id') id: string,
    @Query('orderNum') orderNum?: number,
  ) {
    return this.productService.removeProductStock(id, orderNum);
  }


}
