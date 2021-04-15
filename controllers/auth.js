const { response, request } = require('express');
const Usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');


const login = async(req = request, res = response) => {
    const { email, password } = req.body;
    try {
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                msg: `El usuario con el correo ${email} no está registrado`
            });
        }
        //Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: `El usuario está deshabilitado`
            });
        }
        //Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: `La contraseña es incorrecta`
            });
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Algo salió mal"
        });
    }
}

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;
    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
            console.log("Usuario creado");
        }
        if (!usuario.estado) {
            return res.status(401).json({ msg: "El usuario está bloqueado" });
        }
        //Generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({ usuario, token });
    } catch (error) {
        res.status(400).json({ msg: "todo okey", id_token });
    }
}

module.exports = {
    login,
    googleSignIn
}