import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(ProductsService.name);

    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async findAll() {
        try {
            const products = await this.productModel.find();
            if (!products.length) throw new NotFoundException('No products found');
            return products;
        } catch (error) {
            this.handleError(error, 'findAll');
        }
    }

    async findById(id: string) {
        try {
            const product = await this.productModel.findById(id);
            if (!product) throw new NotFoundException('Product not found');
            return product;
        } catch (error) {
            this.handleError(error, 'findById');
        }
    }

    async create(createProductDto: CreateProductDto, userId: string) {
        try {
            const product = new this.productModel({ ...createProductDto, userId });
            return await product.save();
        } catch (error) {
            this.handleError(error, 'create');
        }
    }


    async remove(id: string, userId: string) {
        try {
            const product = await this.productModel.findById(id);

            if (!product) 
                throw new NotFoundException('Product not found');
            if (product.userId !== userId) 
                throw new ForbiddenException('You are not allowed to delete this product');
            
            return await this.productModel.findByIdAndDelete(id);
        } catch (error) {
            this.handleError(error, 'remove');
        }
    }

    async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
        try {
            const product = await this.productModel.findById(id);
            if (!product) throw new NotFoundException('Product not found');
            if (product.userId !== userId) throw new ForbiddenException('You are not allowed to update this product');
            return await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
        } catch (error) {
            this.handleError(error, 'Error in update');
        }
    }
    private handleError(error: any, context: string): never {
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || 'Internal Server Error';

        // this.logger.error(`Error in '${context}': ${message}`);

        throw new HttpException(message, status);
    }
}