const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosFilterGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');
const { existeEmail, existeUsuarioPorID } = require('../helpers/db-validators');
const { validarCampos, validarJWT} = require('../middlewares');
const router = Router();

router.get('/', usuariosGet);
router.get('/:queryname', usuariosFilterGet);
router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom((id) => existeUsuarioPorID(id)),
    // check('rol').custom((rol) => esRoleValido(rol)),
    validarCampos
], usuariosPut);
router.post('/', [
    check('password', 'El password es obligatorio y más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom((email) => existeEmail(email)),
    validarCampos
], usuariosPost);
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom((id) => existeUsuarioPorID(id)),
    validarCampos
], usuariosDelete);

module.exports = router;