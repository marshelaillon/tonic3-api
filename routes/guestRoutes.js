const router = require('express').Router();
const guestController = require('../controllers/guestController');

// rutas para el admin.
router.get('/get-list', guestController.getList);
router.post('/add-guest', guestController.addGuest);

module.exports = router;

/* 
    IDEA GENERAL:
    en el front tener un estado de redux con todos los mails de la lista de invitados.
    un usuario, al ingresar a la app, solo debe llenar el campo email.
    esto dispara una comparacion para ver si tenemos ese mail en la lsita de invitados.
    si es correcto, deberiamos hacer una comparacion de si este usuario ya fue chequeado o no
    (chequeado seria que, ademas de tnerlo en la lsita de invitados, tengamos una cuenta en la tabla de users con ese mismo email.)
    Si no tenemos una cuenta en users, quiere decir que el usuario esta ingresando por primera vez a la pagina
    o al menos ese se puede suponer. En este caso se le pedira el access code de validacion.


    Otra alternativa seria verificar si esa ip se conecto por primera vez a la app, estuve investigando un poco 
    y quizas con google analitycs quizas podamos hacerlo, de todos modos las direcciones ip se pueden ocultar o modificar, 
    hacer validaciones sobre nuestra propia API me parece lo mas seguro para el caso.

    Con esto tendriamos masomenos resuelto el tema de controlar quien ingresa por primera vez a la web y sabriamos a quien pedirle
    el acces code y quien solo debe loguearse a la app.

    Creo que tambien deberia tener un campo send el invitationModel, para dejar acentado si se le envio la invitacion o no.
*/
