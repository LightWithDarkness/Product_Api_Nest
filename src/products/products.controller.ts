import { Controller, Get, Param, Post, Patch, Delete, HttpException, Body, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly ps: ProductsService) { }

    @Post()
    async createProduct(@Body(ValidationPipe) createProductDto: CreateProductDto) {
        return await this.ps.create(createProductDto, "userId");
    }

    @Get()
    async getAllProducts() {
        return await this.ps.findAll();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return await this.ps.findById(id);
    }

    @Patch(':id')
    async updateProduct(@Param('id') id: string, @Body(ValidationPipe) updateProductDto: UpdateProductDto) {
        return this.ps.update(id, updateProductDto, "userId");
    }

    @Delete(':id')
    async removeProduct(@Param('id') id: string) {
        return this.ps.remove(id, "userId");
    }


}
