const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    };

    // Validacion de Tipos

    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Solo se admiten: ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

    let extensionesValidadas = ['png', 'jpg', 'gif', 'jpeg'];
    
    if(extensionesValidadas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Solo se admiten: ' + extensionesValidadas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre del Archivo
    
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
        };

        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else {
            imagenProducto(id, res, nombreArchivo);
        }
        
    });
});


let imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
              ok: false,
              err
            });
        };

        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        };

        borrarArchivo(usuarioDB.img, 'usuarios');        

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                archivo: nombreArchivo
            });
        });
    });
};

let imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
              ok: false,
              err
            });
        };

        if(!productoDB){
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        };

        borrarArchivo(productoDB.img, 'productos');        

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                archivo: nombreArchivo
            });
        });
    });
};

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    };
}

module.exports = app;