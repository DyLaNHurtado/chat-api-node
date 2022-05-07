/**
 * Declaramos los paquetes a utilizar
 */
 const express = require('express');
 const app = express('./app');
 const server = require('http').createServer(app)
 const chalk = require('chalk');
 const userController=require('./controllers/user');
const user = require('./models/user');
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
let usersConnected=[];
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
        const userEmail = JSON.parse(payload).email 
        const userChats = JSON.parse(payload).chats;
        console.log(payload);
        console.log(chalk.bold.magenta("User connected: "+ userId +" >> " )+ chalk.bold.blue(userEmail));
    

         
         if(userChats.length!=0){
             for (let chat of userChats) {
                socket.join(`chat_${chat}`);
                console.log(`${chalk.yellow(`* ${userEmail} has joined to >> `)+`${`chat_${chat}`}`}`);
             }
         }
         socket.broadcast.emit('userConnected',userId);
 
         /**
          * --------- EMITIR -------------
          * Para probar la conexion con el dispositivo unico le emitimos un mensaje a el dispositivo conectado
          */
         
        
         socket.on('askWhoAreConnected',(name)=>{
             usersConnected.push(name);
             usersConnected=  [... new Set(usersConnected)];
             socket.emit('anwserWhoAreConnected',usersConnected);
         });
         /**
          * ----------- ESCUCHAR -------------
          * Cuando el cliente nos emite un mensaje la api los escucha de la siguiente manera
          */
         socket.on('default', function(res){
 
             switch (res.event) {
                 case 'chatSelected':
                     /**
                      * Si el evento que escucha es "message", se parsea la informacion recibida
                      * y posteriormente se emite un "message" a todos los dispositivos unidos a la sala.
                      */
 
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
         socket.broadcast.emit('userDisconnected',JSON.parse(socket.handshake.query.payload).id);
     });
 });

