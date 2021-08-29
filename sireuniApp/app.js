// IMPORTAÇÃO MÓDULOS
    const express = require('express');
    const handlebars = require('express-handlebars');
    const app = express();
    const admin = require('./routes/Admin');
    const path = require('path');                                       // Serve para trabalhar com diretórios
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    const usuarios = require("./routes/Usuario");
    const passport = require('passport');
    require("./config/auth")(passport)


// CONFIGURAÇÕES    
    // SESSÃO
        app.use(session({
            secret: "f1akirnvtx",
            resave: true, 
            saveUninitialized: true
        }));

    // PASSPORT
        app.use(passport.initialize());
        app.use(passport.session());

    // FLASH
        app.use(flash());

    // MIDDLEWARE
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash("error")
            next();                                                     // Você tem que colocar o Next no middleware
        })
    // EXPRESS
        app.use(express.urlencoded({extended: true}));
        app.use(express.json());
        

    // HANDLEBARS  
        app.engine("handlebars", handlebars({defaultLayout: "main"}));
        app.set("view engine", "handlebars");
    
    // MONGOOSE
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/sireuni", {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
            console.log("Conectado ao banco");
        }).catch((err)=>{
            console.error("Erro ao se conectar: " + err);
        })
    // PUBLIC
        // {A pasta que guarda os arquivos estáticos é a pasta public - __dirname é o camonho absoluto do diretório}
            app.use(express.static(path.join(__dirname,"/public")));         


// ROTAS
    app.use("/", admin);
    app.use("/usuarios", usuarios);

// OUTROS
    // PORTA
        const PORT = 5000;
        app.listen(PORT, ()=>{
            console.log("Servidor rodando!")
        })


