<?php

function usuarioAutenticado()
{
    if (!revisarUsuario()) {
        header('location:login.php');
        exit();
    }
}

function revisarUsuario()
{
    return isset($_SESSION['nombre']);
}

session_start();
usuarioAutenticado();
