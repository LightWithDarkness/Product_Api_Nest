import { Controller, Get, Param, Post, Patch, Delete, HttpException, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
// import { Request } from '@nestjs/common';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly ps: ProductsService) { }

    @Get()
    async getAllProducts() {
        return await this.ps.findAll();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return await this.ps.findById(id);
    }


    @ApiBearerAuth('accessToken')
    @UseGuards(AuthGuard)
    @Post('create')
    async createProduct(@Req() req:Request  ,@Body(ValidationPipe) createProductDto: CreateProductDto) {
        // console.log('request', req['user']);
        return await this.ps.create(createProductDto, req['user']?.sub || 'userId');
    }
    
    @ApiBearerAuth('accessToken')
    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async updateProduct(@Req() req:Request ,@Param('id') id: string, @Body(ValidationPipe) updateProductDto: UpdateProductDto) {
        return this.ps.update(id, updateProductDto, req['user']?.sub);
    }
    
    @ApiBearerAuth('accessToken')
    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async removeProduct(@Req() req:Request,@Param('id') id: string) {
        return this.ps.remove(id, req['user']?.sub);
    }


}
