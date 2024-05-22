$(document).ready(function() {
    $("#Iniciar").click(function() {
        const email = $("#email").val();
        const password = $("#password").val();

        if (!email) {
            $("#mensajeE").text("Por favor ingresa tu correo electrónico");
            return;
        } else {
            $("#mensajeE").text("");
        }

        if (!password) {
            $("#mensajeC").text("Por favor ingresa tu contraseña");
            return;
        } else {
            $("#mensajeC").text("");
        }
    });
    $("#consultaForm").submit(function(event) {
        const name = $("#name").val();
        const phone = $("#phone").val();
        const email = $("#email").val();
        const message = $("#message").val();
        let valid = true;

        $(".errores").hide();

        if (!name) {
            $("#mensaje1").show();
            valid = false;
        }
        if (!phone) {
            $("#mensaje2").show();
            valid = false;
        }
        if (!email || !validateEmail(email)) {
            $("#mensaje3").show();
            valid = false;
        }

        if (!valid) {
            event.preventDefault();
        }
    });
    $("#registerForm").submit(function(event) {
        const nombre = $("#nombre").val();
        const apellido = $("#apellido").val();
        const email = $("#email").val();
        const direccion = $("#direccion").val();
        let valid = true;

        $(".errores").hide();

        if (!nombre) {
            $("#mensajeNombre").show();
            valid = false;
        }
        if (!apellido) {
            $("#mensajeApellido").show();
            valid = false;
        }
        if (!email || !validateEmail(email)) {
            $("#mensajeEmail").show();
            valid = false;
        }
        if (!direccion) {
            $("#mensajeDireccion").show();
            valid = false;
        }

        if (!valid) {
            event.preventDefault();
        }
    });

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
});
