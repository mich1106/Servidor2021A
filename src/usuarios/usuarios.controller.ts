import { Controller, Get, Param, Body, Put, Post, Delete, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { modFilename } from 'src/utils/image.upload.itils';
import { UsuarioEntity } from './usuario.entity';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {

    constructor(private servicio: UsuariosService){

    }

    @Get()
    getAll(@Param() params){
        return this.servicio.obtenerUsuarios(params.id);
    }

    @Get(':id')
    get(@Param() params){
        return this.servicio.obtenerUsuario(params.id);
    }

    @Post()
    create(@Body() usuario:UsuarioEntity){
        return this.servicio.crearUsuario(usuario);
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('imagen',{
            storage: diskStorage({
                destination: './avatars',
                filename: modFilename
            })
        })
    )
    async uploadedFile(@Body() usuario: UsuarioEntity, @UploadedFile() file){
        usuario.avatar = file.filename;

        await this.servicio.crearUsuario(JSON.parse (JSON.stringify(usuario)));

        const response={
            nombreOriginal: file.originalname,
            nombreFinal: file.filename
        };
        return{
            status: HttpStatus.OK,
            message: 'La imagen se subio correctamente',
            data: response
        }
    }

    @Put()
    update (@Body() usuario: UsuarioEntity){
        return this.servicio.actualizarUsuario(usuario);
    }

    @Delete(":id")
    delete(@Param() params){
        return this.servicio.borrarUsuario(params.id);
    }
}
