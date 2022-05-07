/**
 * Declaramos los paquetes a utilizar
 */
 const express = require('express');
 const app = express('./app');
 const server = require('http').createServer(app)
 const chalk = require('chalk');
 const userController=require('./controllers/user')
 const io = require('socket.io')(server,{
    cors:{
        origins: ['http://localhost:4200/**','http://localhost:5000/**']
    }
    });

 
 /**
  * -----------------------------------------------------
  * Socket.io conexion
  * ----------------------------------------------------
  */
  server.listen(5000, function () {
    console.log(`\n>> ${chalk.bold.magenta("WebSockets are listening at port:")}  ${chalk.bold.yellow(5000)}\n`);
});

 io.on('connection', function (socket) {
    console.log("hola");
    
     /** query: En este ejemplo practico queremos enviar una información extra en la conexión
      * acerca del usuario que esta logeado en el Front. Para ello lo enviamos dentro de un objeto por defecto llamado "query"
      */
     let {payload} = socket.handshake.query;
     
     

     if (!payload) {
 
         console.log(`${chalk.red(`Sin payload`)}`);
     
     } else {
         console.log(payload);
        const userId = JSON.parse(payload).id 
        console.log(payload);
        console.log(chalk.bold.magenta("New device connected: "+ userId +" >> " )+ chalk.bold.blue(JSON.parse(payload).email));
         /**
          * Una vez enviado la informacion del usuario conectado en este caso es un peequeño objecto que contiene nombre y id,
          * creamos una sala y lo unimos https://socket.io/docs/rooms-and-namespaces/
          */
         console.log(payload);
    
 
 
         /**
          * --------- EMITIR -------------
          * Para probar la conexion con el dispositivo unico le emitimos un mensaje a el dispositivo conectado
          */
         socket.emit('message', {
             msg: `Hola tu eres el dispositivo ${userId}, perteneces a la sala room_${payload.id}, de ${payload.user}`
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
         console.log('User disconnected >>',chalk.bold.blue(JSON.parse(payload).email));
     });
 });

