import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { CategoryEnum, Product, ProductDocument } from 'src/schema/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { cloudinary } from 'src/common/config/cloudinary.config';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  private async paginate(query: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const products = await this.productModel
      .find(query)
      .skip(skip)
      .limit(limit);
    const total = await this.productModel.countDocuments(query);
    return {
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async uploadImageToCloudinary(file: Express.Multer.File): Promise<string> {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error) return reject(error);
          if (result) {
            resolve(result.secure_url);
          }
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async create(createProductDto: CreateProductDto) {
    const {
      category,
      color,
      title,
      price,
      brand,
      description,
      image,
      stock,
      rating,
      memory,
      screenType,
      protection,
      isFeatured
    } = createProductDto;

    let createProduct: object = {};

    switch (category) {
      case CategoryEnum.Quloqchin:
        if (color && brand) {
          createProduct = await this.productModel.create({
            category,
            color,
            title,
            price,
            brand,
            description,
            image,
            stock,
            rating,
            isFeatured
          });
        } else {
          return { message: `${category} qo'shish uchun kerakli qismlar: color, brand` };
        }
        break;

      case CategoryEnum.Telefon:
        if (brand && memory && screenType && protection) {
          createProduct = await this.productModel.create({
            category,
            title,
            price,
            brand,
            memory,
            screenType,
            protection,
            description,
            image,
            stock,
            rating,
            color,
            isFeatured
          });
        } else {
          return { message: `${category} qo'shish uchun kerakli qismlar: brand, memory, screenType, protection` };
        }
        break;

      case CategoryEnum.SmartSoat:
        if (brand && color) {
          createProduct = await this.productModel.create({
            category,
            title,
            price,
            brand,
            color,
            description,
            image,
            stock,
            rating,
            isFeatured
          });
        } else {
          return { message: `${category} qo'shish uchun kerakli qismlar: brand, color` };
        }
        break;

      case CategoryEnum.Kamera:
        if (brand) {
          createProduct = await this.productModel.create({
            category,
            title,
            price,
            brand,
            description,
            image,
            stock,
            rating,
            isFeatured
          });
        } else {
          return { message: `${category} qo'shish uchun kerakli qism: brand` };
        }
        break;

      case CategoryEnum.Kompyuter:
        if (brand && memory && screenType) {
          createProduct = await this.productModel.create({
            category,
            title,
            price,
            brand,
            memory,
            screenType,
            description,
            image,
            stock,
            rating,
            color,
            isFeatured
          });
        } else {
          return { message: `${category} qo'shish uchun kerakli qismlar: brand, memory, screenType` };
        }
        break;

      case CategoryEnum.Gaming:
        if (title && price) {
          createProduct = await this.productModel.create({
            category,
            title,
            price,
            description,
            image,
            stock,
            rating,
            isFeatured
          });
        } else {
          return { message: `${category} qo'shish uchun kerakli qismlar: title, price` };
        }
        break;

      default:
        throw new BadRequestException("Noto'g'ri kategoriya tanlangan");
    }

    return createProduct;
  }

  async findAll(page: number = 1, limit: number = 10) {
    return this.paginate({}, page, limit);
  }

    async findByFilters(
    category?: string,
    brand?: string,
    screenType?: string,
    screenDiagonal?: string,
    protection?: string,
    memory?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const filter: any = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (screenType) filter.screenType = screenType;
    if (screenDiagonal) filter.screenDiagonal = screenDiagonal;
    if (protection) filter.protection = protection;
    if (memory) filter.memory = memory;

    return this.paginate(filter, page, limit);
  }



  async getAllFilterOptions() {
    const brands = await this.productModel.distinct('brand');
    const screenTypes = await this.productModel.distinct('screenType');
    const screenDiagonals = await this.productModel.distinct('screenDiagonal');
    const protectionClasses = await this.productModel.distinct('protection');
    const memories = await this.productModel.distinct('memory');

    return {
      brands,
      screenTypes,
      screenDiagonals,
      protectionClasses,
      memories,
    };
  }

  async findOne(id: string) {
    const foundedProduct = await this.productModel.findById(id);
    if (!foundedProduct) {
      throw new NotFoundException("Product not found");
    }
    return foundedProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const foundedProduct = await this.productModel.findById(id);

    if (!foundedProduct) {
      throw new NotFoundException("Product not found");
    }

    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
  }

  async remove(id: string) {
    const foundedProduct = await this.productModel.findById(id);

    if (!foundedProduct) {
      throw new NotFoundException("Product not found");
    }
    await this.productModel.findByIdAndDelete(id);
    return `Deleted product`;
  }

  async removeProductStock(id: string, orderNum?: number) {
    const order = orderNum ?? 1;

    const foundedProduct = await this.productModel.findById(id);

    if (!foundedProduct) {
      throw new NotFoundException("Product not found");
    }

    const updatedStock = foundedProduct.stock - order;

    if (updatedStock < 0) {
      throw new BadRequestException("Stock cannot be negative");
    }

    await this.productModel.findByIdAndUpdate(id, { stock: updatedStock });

    return { message: "Stock updated successfully", stock: updatedStock };
  }

  async searchProducts(searchQuery: string): Promise<Product[]> {
    
    const regex = new RegExp(searchQuery, 'i')
    return this.productModel.find({
      $or: [
        { title: { $regex: regex } },
        { brand: { $regex: regex } },
        { description: { $regex: regex } },
      ],
    }).exec();
  }

  async updateProductRating(productId: string): Promise<void> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
  
    const totalStars = product.comments.reduce((acc, comment) => acc + comment.star, 0);
    const numberOfComments = product.comments.length;
  
    const newRating = numberOfComments > 0 ? totalStars / numberOfComments : 0;
  
    product.rating = newRating;
    await product.save();
  }
  
  async addComment(productId: string, userId: string, username: string, star: number, text: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
  
    const newComment = {
      userId,
      username,
      star,
      text,
      createdAt: new Date(),
    };
    product.comments.push(newComment);
  
    await this.updateProductRating(productId);
  
    await product.save();
  
    return product;
  }
  
}
