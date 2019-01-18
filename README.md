Programa de control de ventas de una pizzeria:
Este programa no require de una libreria para correrlo, la base de datos es local
todo se guarda en .data, las configuraciones estan guardadas estan guardados en el
archivo config dentro de la carpeta de lib. El sistema tiene su propia
auntetificacion y usa la libreria de node para la encryptacion. Las vistas son
son devueltos de las rutas get como un archivo html.
API:
Usuarios:
Requiere: firstName, lastName, email, direction, password, tosAgreement

api/users post: para la creacion de usuarios.

Requiere: email, headers token

api/users get: para tomar un registro de la base de datos.

Requiere: email, token
Optional data: firstName, lastName, password (Por lo menos uno de los campos debe ser especificado)

api/users put: para cambiar una

Requiere: email, token

api/users delete: para eliminar un usuario

Tokens:
Requiere: email, password

api/tokens post: Para la auntetificacion de la cuenta, al verificar la cuenta y contraseña
guarda un token con el id del token, el tiempo de expiracion y el correo.

requiere: id

api/tokens get: Retira el token de la base de datos.

requiere: id

api/tokens put: Renueva el tiempo de expiracion del token.

requiere: id

api/tokens delete: elimina el token de la base de datos.

Payments:
Requiere: token, order id

api/payments post: genera un cargo a la pagina stripe y luego envia un correo
al cliente que genero la compra.

Orders:
requiere: token,
Requiere data : id, menu items{description , quantity}, token
opcional: direccion

api/order post: Genera una orden de compra

requiere: idorder, token

api/order get: Retira la orden de compra de la base de datos.

requiere: token for authetication,
opcional: orderData, direccion

api/order put: Cambia los datos de la orden.

requiere: idorder, token

api/order delete: elimina la orden de la base de datos.

Menu
requiere:  name, description, price

api/menu post: crea un producto en la base de datos.

requiere: token

api/menu get: saca una lista de productos de la base de datos.

Por hacer:

retirar la descripcion de un producto de la base de datos.
crear cuenta de administrador para la limitar a un administrador para agregar
eliminar y modificar el menu.
Vista de carrito de compras
Vista de proceso de compras
