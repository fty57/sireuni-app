// IMPORTANDO MÓDULOS
    const localStrategy = require('passport-local').Strategy;
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs')
    // MODEL DE USUÁRIO
        require("../models/Usuario")
        const Usuario = mongoose.model('usuarios');

module.exports = function(passport) {

    passport.use(new localStrategy({usernameField: "matricula", passwordField: "senha"}, (matricula, senha, done) =>{

        // {Conferir se pela matricula informada, tem-se um usuário com a mesma matrícula}
        Usuario.findOne({matricula: matricula}).then((usuario) => {
            if(!usuario){
                // {Dados da conta - Se ocorreu com sucesso ou não - Mensagem}
                return done(null, false, {message: "Essa conta não existe"})
            }

            // {Comparar a senha informada, com a senha do banco}
            bcrypt.compare(senha, usuario.senha, (erro, ok) => {

                // {Se tudo estiver okay, faça login}
                if(ok){
                    return done(null, usuario)  
                
                // {Se não, não faça login e retorne uma mensagem para o usuário}
                }else{
                    return done(null, false, {message: "Credênciais incorretas."})
                }

            })

        }).catch((err) => {
            console.log("Ocorreu o seguinte erro: " + err.message);
        })

    }))

    // {Assim que o usuário logar, sua sessão será serializada}
        passport.serializeUser((usuario, done)=>{
            done(null, usuario.id)
        })
    
    // {Assim que ele deslogar, sua sessão será deserializada}
        passport.deserializeUser((id, done)=>{
            Usuario.findById(id, (err, usuario) => {
                done(err, usuario)
            })
        })
}