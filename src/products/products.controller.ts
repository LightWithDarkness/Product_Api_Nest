import { Controller, Get, Param, Post, Patch, Delete, HttpException, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { errorHandlerT } from 'src/common/error-handler';

@Controller('products')
export class ProductsController {
    constructor(private readonly ps: ProductsService) { }

    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) {
        try {
            return await this.ps.create(createProductDto,"userId");
        } catch (error) {
            // return errorHandlerT(error);// manage the error handlers
            return this.handleError(error);
        }
    }
    @Get()
    async getAllProducts() {
        try {
            return await this.ps.findAll();
        }
        catch (error) {
            return this.handleError(error);
        }
    }
    @Get(':id')
    async getProductById(@Param('id') id: string) {
        try {
            return await this.ps.findById(id);
        } catch (error) {
            return this.handleError(error);
        }
    }
    @Patch(':id')
    async updateProduct(@Param('id') id:string, @Body() updateProductDto:UpdateProductDto){
        try {
            return this.ps.update(id,updateProductDto,"userId");
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Delete(':id')
    async removeProduct(@Param('id') id:string){
        try {
            return this.ps.remove(id,"userId");
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleError(error: any) {
        if (error instanceof HttpException) {
            throw error;
        } else {
            throw new HttpException('Internal Server Error', 500);
        }
    }
}
