const Usuario = require("../models/usuario");

const existeEmail = async(email = '') => {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email ${email} ya se encuentra registrado`);
    }
}

const existeUsuarioPorID = async(id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no se encuentra registrado`);
    }
}

module.exports = {
    existeEmail,
    existeUsuarioPorID
};