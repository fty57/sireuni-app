// IMPORTAÇÃO MÓDULOS
    const express = require('express');
    const router = express.Router();
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const passport = require('passport');
    // MODELS
        // USUÁRIOS
            require("../models/Usuario")
            const Usuario = mongoose.model('usuarios');

// ROTAS
    // GET
        // REGISTRO
            router.get("/registro", (req, res) => {
                res.render("usuarios/registro.handlebars")
            })

        // LOGIN
            router.get("/login", (req, res) => {
                res.render("login/login.handlebars", {style: "login.css"})
            })

    // POST
        // ENVIAR REGISTRO
            router.post("/registro", (req, res) => {
                var erros = [];
                if(!req.body.matricula || typeof req.body.matricula == undefined || req.body.matricula == null){
                    erros.push({texto: "Matrícula inválida"});
                    }  
                

                if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
                    erros.push({texto: "E-mail inválido"});
                }

                if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
                    erros.push({texto: "Senha inválida"});
                }

                if(req.body.senha.length < 4){
                    erros.push({texto: "Senha muito curta"})
                }

                if(req.body.senha != req.body.senha2){
                    erros.push({texto: "As senhas são diferentes, tente novamente!"})
                }

                if(erros.length > 0){
                    res.render("usuarios/registro", {erros: erros});

                }else{
                    // Pesquisando um usuário pelo email
                    Usuario.findOne({email: req.body.email}).then((usuario) => {
                        if(usuario){
                            req.flash("error_msg", "Já existe uma conta com esse e-mail.")
                            res.redirect("/usuarios/registro")
                        }else{
                            // Salvando o novo usuário
                            const novoUsuario = new Usuario({
                                matricula : req.body.matricula,
                                email: req.body.email,
                                senha: req.body.senha
                            });

                            // Encriptando a senha
                            bcrypt.genSalt(10, (erro, salt) => {
                                bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                                    if(erro){
                                        req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
                                        res.redirect("/usuarios/registro");
                                    }

                                    novoUsuario.senha = hash;

                                    novoUsuario.save().then(() => {
                                        req.flash("success_msg", "Usuário criado com sucesso!");
                                        res.redirect("/usuarios/registro");
                                    }).catch((err) => {
                                        console.log(err);
                                        req.flash("error_msg", "Houve um erro ao criar usuário, tente novamente.")
                                        res.redirect("/usuarios/registro");
                                    })

                                    
                                })
                            })
                        }
                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro interno.")
                        res.redirect("/")
                    })
                }
            })

        // ENVIAR LOGIN
            router.post("/login", (req, res, next) => {
                // FUNÇÃO PARA AUTENTICAR
                passport.authenticate("local", {
                    successRedirect: "/",
                    failureRedirect: "/usuarios/login",
                    failureFlash: true
                })(req, res, next);
            })
        

module.exports = router;