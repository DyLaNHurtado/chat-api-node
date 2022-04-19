/**
 * Declaramos los paquetes a utilizar
 */
 const express = require('express');
 const app = express('./app');
 const server = require('http').createServer(app)
 const io = require('socket.io')(server,{
    cors:{
        origin:"*"
    }
    });

 const chalk = require('chalk');
 
 /**
  * -----------------------------------------------------
  * Socket.io conexion
  * ----------------------------------------------------
  */
  server.listen(5000, function () {
    console.log(`\n>> ${chalk.bold.magenta("Socket is listening at port:")}  ${chalk.bold.yellow(5000)}\n`);
});

 io.on('connection', function (socket) {
    console.log("hola");
     /** handshake: Es el id de conexion con el dispositivo cliente */
     const id_handshake = socket.handshake.id;
    
     /** query: En este ejemplo practico queremos enviar una información extra en la conexión
      * acerca del usuario que esta logeado en el Front. Para ello lo enviamos dentro de un objeto por defecto llamado "query"
      */
     let {payload} = socket.handshake.query;
 
     
     console.log(`${chalk.blue(`Nuevo dispositivo conectado: ${id_handshake}`)}`);
 
     if (!payload) {
 
         console.log(`${chalk.red(`Sin payload`)}`);
     
     } else {
        console.log(payload);
         /**
          * Una vez enviado la informacion del usuario conectado en este caso es un peequeño objecto que contiene nombre y id,
          * creamos una sala y lo unimos https://socket.io/docs/rooms-and-namespaces/
          */
         socket.join(`room_${payload.id}`);
 
         console.log(`${chalk.yellow(`El dispositivo ${id_handshake} se unio a -> ${`room_${payload.id}`}`)}`);
 
         /**
          * --------- EMITIR -------------
          * Para probar la conexion con el dispositivo unico le emitimos un mensaje a el dispositivo conectado
          */
         socket.emit('message', {
             msg: `Hola tu eres el dispositivo ${id_handshake}, perteneces a la sala room_${payload.id}, de ${payload.user}`
         });
 
         /**
          * ----------- ESCUCHAR -------------
          * Cuando el cliente nos emite un mensaje la api los escucha de la siguiente manera
          */
         socket.on('default', function(res){
 
             switch (res.event) {
                 case 'message':
                     /**
                      * Si el evento que escucha es "message", se parsea la informacion recibida
                      * y posteriormente se emite un "message" a todos los dispositivos unidos a la sala.
                      */
                     const inPayloadCookie = JSON.parse(res.cookiePayload);
                     const inPayload = res.payload;
 
                     io.to(`room_${inPayloadCookie.id}`).emit('message',{
                         msg: `Mensaje a todos los dispositivos de la sala room__${inPayloadCookie.id}: ${inPayload.message}`
                     });
 
                     break;
                 default:
                     /** Otros posibles casos */
                     break;
             }
 
         });
     };
 
     /**
      * Si un dispositivo se desconecto lo detectamos aqui
      */
     socket.on('disconnect', function () {
         console.log('user disconnected');
     });
 });

