const express = require('express');

const Categoria = require('../models/categoria');
const {verificaToken, verificaAdmin} = require('../middlewares/autenticacion');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {
    
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if(err){
                res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                categoria
            });
        });
});

app.get('/categoria/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoria) => {
            if(err){
                res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                categoria
            });
        });
});

app.post('/categoria', [verificaToken, verificaAdmin], (req, res) => {
    
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        
        if(err){
            res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, {new:true, runValidators: true}, (err, categoriaDB) => {
        
        if(err){
            res.status(500).json({
                ok: false,
                err
            });
        };

        if(!categoriaDB){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existes'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(!categoriaBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe'
                }
            });
        };

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    });
});

module.exports = app;