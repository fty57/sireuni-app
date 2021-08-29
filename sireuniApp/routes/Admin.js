// IMPORTAÇÃO MÓDULOS
    const express = require('express');
    const router = express.Router();                                // Responsável para criar rotas separadas
    const mongoose = require('mongoose');
    // MODELS
        // EVENTOS
            require("../models/Evento");
            const Evento = mongoose.model("eventos");

        // RECEITAS
            require("../models/Receita");
            const Receita = mongoose.model("receitas");
        
        // FORUM
            require("../models/Forum");
            const Forum = mongoose.model("forums");

// ROTAS
    // GET
        // HOMEPAGE
            router.get("/", (req, res) => {
                res.render("comunidade/comunidade", {style: "comunidade.css"})
            })

        // ADMIN
            router.get("/admin", (req, res) => {
                res.render("admin/index.handlebars")
            });

        // CONTATO
            router.get("/contato", (req, res) => {
                res.render("contato/contato", {style: "contato.css"})
            })

        // EVENTOS
            router.get("/eventos", (req, res) => {
                Evento.find().sort({data: "desc"}).then((eventos) => { // {Sorteando os eventos, com base em suas datas}
                    res.render("eventos/eventos.handlebars", {eventos: eventos.map(eventos => eventos.toJSON()), style: "evento.css"});
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os eventos.");
                    res.redirect("/")
                }) 
            })

            router.get("/eventos/add", (req, res)=>{
                res.render("eventos/add-evento.handlebars", {style: "evento.css"})
            })

            router.get("/eventos/edit/:id", function(req, res){           
                Evento.findOne({_id: req.params.id}).lean().then((evento) => {
                    res.render("eventos/edit-evento.handlebars", {evento: evento, style: "evento.css"})
                }).catch((err) => {
                    req.flash("error_msg", "Esse evento não existe.");
                    res.redirect("/eventos");
                })       
            })

        // RECEITAS
            router.get("/receitas", (req, res) => {
                Receita.find().then((receitas) => { // {Procurando as receitas para serem listadas}
                    res.render("receitas/receitas.handlebars", {receitas: receitas.map(receitas => receitas.toJSON()), style: "receita.css"});
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar as receitas.");
                    res.redirect("/")
                })    
            });

            router.get("/receitas/add", (req, res) => {
                res.render("receitas/add-receita.handlebars", {style: "receita.css"})
            })

            router.get("/receitas/edit/:id", function(req, res){
                Receita.findOne({_id: req.params.id}).lean().then((receita) => {
                    res.render("receitas/edit-receita.handlebars", {receita: receita, style: "receita.css"});
                }).catch((err) => {
                    req.flash("error_msg", "Essa receita não existe.");
                    res.redirect("/receitas");
                })

            })

        // FORUM
            router.get("/forum", (req, res) => {
                Forum.find().sort({data: "desc"}).then((forums) => {
                    res.render("forum/forum.handlebars", {forums: forums.map(forums => forums.toJSON()), style: "forum.css"});
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os tópicos do fórum.");
                    res.redirect("/");
                })
            })

            router.get("/forum/add", (req, res) => {
                res.render("forum/add-forum.handlebars", {style: "forum.css"});
            })

            router.get("/forum/edit/:id", (req, res) => {
                Forum.findOne({_id: req.params.id}).lean().then((forum) => {
                    res.render("forum/edit-forum.handlebars", {forum:forum, style: "forum.css"});
                }).catch((err) => {
                    req.flash("error_msg", "Esse tópico não existe no fórum.");
                    res.redirect("/forum");
                })
            })


    // POST
        // EVENTOS
            router.post("/eventos/novo", (req, res)=>{
                // VALIDAÇÃO
                    var erros = [];

                    // SE NENHUM NOME FOR INFORMADO
                        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                            erros.push({texto: "Nome do evento não inserido, inválido."});
                        }
                    
                    // SE NENHUMA DESCRIÇÃO FOR INFORMADA
                        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
                            erros.push({texto: "Descrição do evento não inserida, inválida."});
                        }

                    // SE O NOME FOR MUITO PEQUENO
                        if(req.body.nome.length < 5){
                            erros.push({texto: "O nome do evento é muito pequeno."});
                        }

                    // SE A DESCRIÇÃO FOR MUITO PEQUENA
                        if(req.body.descricao.length < 10){
                            erros.push({texto: "A descrição do evento é muito pequena."})
                        }
                    
                    // SE TIVER OCORRIDO ALGUM ERRO
                    if(erros.length > 0){
                        res.render("eventos/add-evento.handlebars", {erros: erros});
                    
                    // SE ESTIVER TUDO OKAY, CRIE O EVENTO
                    }else{
                        const novoEvento = {
                            nome : req.body.nome,
                            descricao : req.body.descricao
                        }
            
                        new Evento(novoEvento).save().then(()=>{
                            req.flash("success_msg", "Evento criado com sucesso!")
                            res.redirect('/eventos')
                        }).catch((err)=>{
                            req.flash("error_msg", "Houve um erro ao salvar o evento, tente novamente!")
                            res.redirect("/eventos")
                        })
                    }

            })

            router.post("/eventos/edit", (req, res) =>{
                // VALIDAÇÃO
                var erros = [];

                // SE NENHUM NOME FOR INFORMADO
                    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                        erros.push({texto: "Nome do evento não inserido, inválido."});
                    }
                
                // SE NENHUMA DESCRIÇÃO FOR INFORMADA
                    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
                        erros.push({texto: "Descrição do evento não inserida, inválida."});
                    }

                // SE O NOME FOR MUITO PEQUENO
                    if(req.body.nome.length < 5 ){
                        erros.push({texto: "O nome do evento é muito pequeno."});
                    }
                // SE A DESCRIÇÃO FOR MUITP PEQUENA
                    if(req.body.descricao.length < 10){
                        erros.push({texto: "A descrição do evento é muito pequena."})
                    }

                    if(erros.length > 0){
                        res.render("eventos/edit-evento.handlebars", {erros: erros, style: "evento.css"});
                    }else{
                        // {Procurar se o evento fornecido existe dentro de Evento - Para EDITAR}
                        Evento.findOne({_id: req.body.id}).then((evento) => {
                            evento.nome = req.body.nome;
                            evento.descricao = req.body.descricao;

                            evento.save().then(() => {
                                req.flash('success_msg',"Evento editado com sucesso!");
                                res.redirect("/eventos");
                            }).catch((err) => {
                                req.flash('error_msg',"Houve um erro ao salvar a edição do evento.");
                                res.redirect("/eventos");
                            })

                        }).catch((err) => {
                            req.flash("error_msg","Houve um erro ao editar o evento.")
                            res.redirect("/eventos");
                        })
                    }
          
            })

            router.post("/eventos/deletar", (req, res) => {
                // {Procurar se o evento fornecido existe dentro de Evento - Para DELETAR}
                Evento.deleteOne({_id: req.body.id}).then(() => {
                    req.flash("success_msg","Evento deletado com sucesso!")
                    res.redirect("/eventos");
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao deletar o evento.");
                    res.redirect("/eventos");
                })
            })

        // RECEITAS
            router.post("/receitas/nova", (req, res) => {
                // VALIDAÇÃO
                var erros = [];
                
                    // SE NENHUM NOME FOR INFORMADO
                        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                            erros.push({texto: "Nome de receita não inserida, inválida."});
                        }
                    
                    // SE NENHUM INGREDIENTE FOR INFORMADO
                        if(!req.body.ingredientes || typeof req.body.ingredientes == undefined || req.body.ingredientes == null){
                            erros.push({texto: "Ingredientes não inseridos, inválidos."});
                        }

                    // SE NENHUMA DESCRIÇÃO FOR INFORMADA
                        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
                            erros.push({texto: "Descrição não inserida, inválida."});
                        }
                    
                    // SE NENHUMA RENDIMENTO FOR INFORMADO
                        if(!req.body.rendimento || typeof req.body.rendimento == undefined || req.body.rendimento == null){
                            erros.push({texto: "Rendimento não inserido, inválido."})
                        }

                    // SE NENHUMA AVALIAÇÃO FOR INFORMADA
                        if(!req.body.avaliacao || typeof req.body.avaliacao == undefined || req.body.avaliacao == null){
                            erros.push({texto: "Avaliação não inserida, inválida."})
                        }

                    // SE O NOME FOR INSUFICIENTE
                        if(req.body.nome.length < 5){
                            erros.push({texto: "O nome da receita é muito pequena."})
                        }

                    // SE OS INGREDIENTES FOREM INSUFICIENTES
                        if(req.body.ingredientes.length < 8){
                            erros.push({texto: "A lista de ingredientes é insuficiente."})
                        }

                    // SE A DESCRIÇÃO FOR INSUFICIENTE
                        if(req.body.descricao.length < 10){
                            erros.push({texto: "Descrição de receita muito pequena."})
                        }

                    // SE PRECISAR VALIDAR ALGUMA COISA

                // SE TIVER OCORRIDO ALGUM ERRO, INFORME-O PARA O USUÁRIO. TENTE NOVAMENTE.
                    if(erros.length > 0){
                        res.render("receitas/add-receita.handlebars", {erros: erros , style: "receita.css"});

                // CASO CONTRÁRIO, CRIE A RECEITA
                }else{
                    const novaReceita = {
                        nome : req.body.nome,
                        ingredientes: req.body.ingredientes,
                        descricao : req.body.descricao,
                        rendimento: req.body.rendimento,
                        avaliacao : req.body.avaliacao
                    }

                    new Receita(novaReceita).save().then(() => {
                        req.flash("success_msg", "Receita criada com sucesso.");
                        res.redirect("/receitas")
                    }).catch((err) => {
                        req.flash("error_msg", "Houve um erro ao salvar a receita, tente novamente!");
                        res.redirect("/receitas");
                    });
                }
                
            })

            router.post("/receitas/edit", (req, res)=>{
                            // VALIDAÇÃO
                            var erros = [];
                
                                // SE NENHUM NOME FOR INFORMADO
                                    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                                        erros.push({texto: "Nome de receita não inserida, inválida."});
                                    }
                            
                                // SE NENHUM INGREDIENTE FOR INFORMADO
                                    if(!req.body.ingredientes || typeof req.body.ingredientes == undefined || req.body.ingredientes == null){
                                        erros.push({texto: "Ingredientes não inseridos, inválidos."});
                                    }

                                // SE NENHUMA DESCRIÇÃO FOR INFORMADA
                                    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
                                        erros.push({texto: "Descrição não inserida, inválida."});
                                    }
                                
                                // SE NENHUMA RENDIMENTO FOR INFORMADO
                                    if(!req.body.rendimento || typeof req.body.rendimento == undefined || req.body.rendimento == null){
                                        erros.push({texto: "Rendimento não inserido, inválido."})
                                    }

                                // SE NENHUMA AVALIAÇÃO FOR INFORMADA
                                    if(!req.body.avaliacao || typeof req.body.avaliacao == undefined || req.body.avaliacao == null){
                                        erros.push({texto: "Avaliação não inserida, inválida."})
                                    }

                                // SE O NOME FOR INSUFICIENTE
                                    if(req.body.nome.length < 5){
                                        erros.push({texto: "O nome da receita é muito pequena."})
                                    }

                                // SE OS INGREDIENTES FOREM INSUFICIENTES
                                    if(req.body.ingredientes.length < 8){
                                        erros.push({texto: "A lista de ingredientes é insuficiente."})
                                    }

                                // SE A DESCRIÇÃO FOR INSUFICIENTE
                                    if(req.body.descricao.length < 10){
                                        erros.push({texto: "Descrição de receita muito pequena."})
                                    }

                                // SE PRECISAR VALIDAR ALGUMA COISA
                
                            // SE TIVER OCORRIDO ALGUM ERRO, INFORME-O PARA O USUÁRIO. TENTE NOVAMENTE.
                            if(erros.length > 0){
                                res.render("receita/edit-receita.handlebars", {style: "receita.css"})

                            // CASO CONTRÁRIO, EDITE A RECEITA
                            }else{
                                Receita.findOne({_id:req.body.id}).then((receita)=>{
                                    receita.nome = req.body.nome;
                                    receita.ingredientes = req.body.ingredientes;
                                    receita.descricao = req.body.descricao;
                                    receita.rendimento = req.body.rendimento;
                                    receita.avaliacao = req.body.avaliacao;
                    
                                    receita.save().then(()=>{
                                        req.flash("success_msg", "Receita editada com sucesso!");
                                        res.redirect("/receitas");
                                    }).catch((err) => {
                                        req.flash("error_msg", "Houve um erro ao salvar a edição da receita.");
                                        res.redirect("/receitas");
                                    })
                    
                                }).catch((err)=>{
                                    req.flash('error_msg',"Houve um erro ao editar a receita.");
                                    res.redirect("/receitas");
                                })
                            }



            })

            router.post("/receitas/deletar", (req, res) =>{
                Receita.deleteOne({_id: req.body.id}).then(() => {
                    req.flash("success_msg", "Receita deletada com sucesso!");
                    res.redirect("/receitas");
                }).catch((err) =>{
                    req.flash("error_msg", "Houve um erro ao deletar a receita.");
                    res.redirect("/receitas");
                })
            })

        // FORUM
            router.post("/forum/novo", (req, res) => {
                // VALIDAÇÃO
                var erros = [];

                    // SE NENHUM NOME FOR INFORMADO
                        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                            erros.push({texto: "Nome do tópico não inserido, inválido."});
                        }
                    
                    // SE NENHUM TITULO FOR INFORMADO
                        if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
                            erros.push({texto: "Título do tópico não inserido, inválido."});
                        }

                    // SE NENHUM TITULO FOR INFORMADO
                        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
                            erros.push({texto: "Descrição do tópico não inserida, inválida."});
                        }

                    // SE A DESCRIÇÃO FOR INSUFICIENTE
                        if(req.body.descricao.length < 10){
                            erros.push({texto: "Descrição do tópico muito pequena."})
                        }
                    
                        // SE PRECISAR VALIDAR ALGUMA COISA
                        
                    // SE TIVER OCORRIDO ALGUM ERRO, INFORME-O PARA O USUÁRIO. TENTE NOVAMENTE.
                        if(erros.length > 0){
                            res.render("forum/forum.handlebars", {erros: erros, style: "forum.css"});

                    }else{
                        const novoForum = {
                            nome: req.body.nome,
                            titulo: req.body.titulo,
                            descricao : req.body.descricao
                        }

                        new Forum(novoForum).save().then(()=>{
                            req.flash("success_msg","Tópico criado com sucesso!");
                            res.redirect("/forum");
                        }).catch((err)=>{
                            req.flash("error_msg","Houve um erro ao salvar o tópico no fórum, tente novamente!");
                            res.redirect("/forum");
                        })

                    }
                    
            })

            router.post("/forum/edit", (req, res)=>{
                var erros = [];

                // SE NENHUM NOME FOR INFORMADO
                    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                        erros.push({texto: "Nome do tópico não inserido, inválido."});
                    }
                
                // SE NENHUM TITULO FOR INFORMADO
                    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
                        erros.push({texto: "Título do tópico não inserido, inválido."});
                    }

                // SE NENHUM TITULO FOR INFORMADO
                    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
                        erros.push({texto: "Descrição do tópico não inserida, inválida."});
                    }

                // SE A DESCRIÇÃO FOR INSUFICIENTE
                    if(req.body.descricao.length < 10){
                        erros.push({texto: "Descrição do tópico muito pequena."})
                    }
                
                    // SE PRECISAR VALIDAR ALGUMA COISA
                    
                // SE TIVER OCORRIDO ALGUM ERRO, INFORME-O PARA O USUÁRIO. TENTE NOVAMENTE.
                    if(erros.length > 0){
                        res.render("forum/edit-forum.handlebars", {style: "forum.css"})
                }else{
                    Forum.findOne({_id: req.body.id}).then((forum)=>{
                        forum.nome = req.body.nome;
                        forum.titulo = req.body.titulo;
                        forum.descricao = req.body.descricao;

                        forum.save().then(()=>{
                            req.flash("success_msg", "Tópico do fórum editado com sucesso!");
                            res.redirect("/forum");
                        }).catch(err=>{
                            req.flash("error_msg", "Houve um erro ao salvar a edição no fórum.")
                            res.redirect("/forum");
                        })

                    }).catch((err)=>{
                        req.flash("error_msg", "Houve um erro ao editar o fórum.");
                        res.redirect("/forum");
                    })
                }
            })

            router.post("/forum/deletar", (req, res) => {
                Forum.deleteOne({_id: req.body.id}).then(() => {
                    req.flash("success_msg", "Tópico do fórum deletado com sucesso!");
                    res.redirect("/forum");
                }).catch((err)=>{
                    req.flash("error_msg", "Houve um erro ao deletar o tópico do fórum!");
                    res.redirect("/forum");
                })
            })


module.exports = router;