const express = require('express');

const Producto = require('../models/producto');
const {
    verificaToken
} = require('../middlewares/autenticacion');

const app = express();


//////////////////////////////
//  Buscar todos los productos
//////////////////////////////

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({disponible: true}, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto,
                    cuantos: conteo
                });
            });
        });

});

//////////////////////////////
//  Buscar por ID
//////////////////////////////


app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                });
            };
            
            if(!productoDB){
                res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Id no existe'
                    }
                });
            };

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//////////////////////////////
//  Buscar por Nombre
//////////////////////////////

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regexp = new RegExp(termino, 'i');

    Producto.find({nombre: regexp})
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre')
        .exec((err, productos) => {
            
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productos
            });
        });
});

//////////////////////////////
//  Crear nuevo Producto
//////////////////////////////


app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            productoDB
        });
    });
});

//////////////////////////////
//  Actualizar un producto
//////////////////////////////


app.put('/producto/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(!productoDB){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        };

        productoDB.nombre = body.nombre;
        productoDB.descripcion = body.descripcion;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;

        productoDB.save((err, productoGuardado) => {
            
            if(err){
                res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});

//////////////////////////////
//  Eliminar un producto
//////////////////////////////


app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        };

        if(!productoDB){
            res.status(500).json({
                ok: false,
                err: {
                    message: 'ID no Existe'
                }
            });
        };

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });
        });
    });
});

module.exports = app;