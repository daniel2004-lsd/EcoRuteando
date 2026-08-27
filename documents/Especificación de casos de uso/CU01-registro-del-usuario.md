# Caso de Uso N° 1 — Registro del Usuario.

> Requisito asociado: **RF1** · SRS EcoRuteando, sección 4.2

**Descripción:** La aplicación mostrará un formulario donde se registran los datos del usuario, para que pueda ingresar.

| Campo | Descripción |
|---|---|
| **Nombre** | Registro del Usuario. |
| **Prioridad** | Alta |
| **Precondición** | El usuario deberá registrarse, con un correo y una contraseña. |

## Secuencia normal

| Paso | Acción | Sistema |
|:---:|---|---|
| 1 | El usuario ingresa el nombre | El usuario deberá ingresar sus datos personales, tales como nombre, teléfono, correo electrónico. |
| 2 | El usuario deberá ingresar su correo | El usuario deberá ingresar unos caracteres con el cual será identificado para acceder al aplicativo. |
| 3 | El usuario deberá ingresar una contraseña | El usuario deberá ingresar unos caracteres para acceder inmediatamente a la pantalla donde realizará el proceso. |
| 4 | Almacena información en base de datos | Una vez el usuario se haya autentificado su información quedará guardada en el sistema. |
| 5 | Mostrar la información del usuario | Una vez finalizado el proceso, el sistema enviará al correo electrónico la información registrada por el usuario. |

## Postcondición

Si los datos del formulario de inicio de sesión son correctos, el usuario accede a la pantalla de inicio del aplicativo.

## Excepciones (flujo alterno)

| Paso | Acción |
|:---:|---|
| 1 | Si el usuario ingresa un dato incorrecto |
| 2 | El sistema mostrará error en el sistema. |

| Campo | Descripción |
|---|---|
| **Actores** | Usuario, Administrador |
| **Comentarios** | Validar que el correo no exista en la base de datos |
