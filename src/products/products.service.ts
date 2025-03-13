import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async findAll() {
        try {
            return await this.productModel.find();
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve products');
        }
    }

    async findById(id: string) {
        try {
            let product = await this.productModel.findById(id);
            if (!product) throw new NotFoundException('Product not found');
            return product;
        } catch (error) {
            throw new InternalServerErrorException('Failed to retrieve the product');
        }
    }

    async create(createProductDto: CreateProductDto, userId: string) {
        try {
            let product = new this.productModel({ ...createProductDto, userId });
            return await product.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to create product');
        }
    }

    async remove(id: string, userId: string) {
        try {
            let product = await this.productModel.findById(id);
            if (!product) throw new NotFoundException('Product not found');
            console.log(product);
            if (product.userId !== userId) throw new ForbiddenException('You are not allowed to delete this product');
            return await this.productModel.findByIdAndDelete(id);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete product');
        }
    }

    async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
        try {
            let product = await this.productModel.findById(id);
            if (!product) throw new NotFoundException('Product not found');
            if (product.userId !== userId) throw new ForbiddenException('You are not allowed to update this product');
            return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
        } catch (error) {
            throw new InternalServerErrorException('Failed to update product');
        }
    }
}