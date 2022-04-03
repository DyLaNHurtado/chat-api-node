
require('../src/index');
const mongoose = require("mongoose");
const Chat = require('../src/models/chat');
const Message = require('../src/models/message');
const User = require('../src/models/user');
const {api} = require('./helpers');
const {initialMessages,initialChats,initialUsers} = require('./helpers');
beforeEach(async() =>{
    await Message.deleteMany({});
    const m1 = new Message(initialMessages[0]);
    await m1.save();
    const m2 = new Message(initialMessages[1]);
    await m2.save();

    await Chat.deleteMany({});
    const c1 = new Chat(initialChats[0]);
    await c1.save();
    const c2 = new Chat(initialChats[1]);
    await c2.save();

    await User.deleteMany({});
    const u1 = new User(initialUsers[0]);
    await u1.save();
    const u2 = new User(initialUsers[1]);
    await u2.save();
});
// --- GLOBAL --- //
describe('global', () => {
test('not found', async()=>{
    await api
    .get('/')
    .expect(404)
});
}),

    // --- MESSAGE --- //
describe('Messages', () => {
test('there are messages', async()=>{
    const response =await Message.find({})
    expect(response.body).length==initialMessages.length;
});

test('a post of message is valid',async()=>{
    const newMessage = {
        text:'sdfsd',
        author:"6240ca2d979f14638d359a29",
        chat:"6240ca3cc8e3bae427c75cc4"
    }
    await api.post(process.env.API_MAINENDPOINT+'message')
    .send(newMessage)
    .expect(200)
});

test('message without content is not added',async()=>{
    const newMessage = {
        chat:"6240ca3cc8e3bae427c75cc4"
    }
    await api.post(process.env.API_MAINENDPOINT+'message')
    .send(newMessage)
    .expect(400)
});

test('getAllByChat works',async()=>{
    const messages = await Message.find({});
    const chatId= messages[0].chat;
    await api.get(process.env.API_MAINENDPOINT+`message/chat/${chatId}`)
    .expect(200);

    const thisIdNotExist = "62488c3da0f2dc4c561e292a";
    await api.get(process.env.API_MAINENDPOINT+`message/chat/${thisIdNotExist}`)
    .expect(404);

    await api.get(process.env.API_MAINENDPOINT+`message/chat/${1234}`)
    .expect(500);
});

test('getById works',async()=>{
    const messages = await Message.find({});
    const id= messages[0]._id;
    await api.get(process.env.API_MAINENDPOINT+`message/${id}`)
    .expect(200);

    const thisIdNotExist = "62488c3da0f2dc4c561e292a";
    await api.get(process.env.API_MAINENDPOINT+`message/${thisIdNotExist}`)
    .expect(404);

    await api.get(process.env.API_MAINENDPOINT+`message/${1234}`)
    .expect(400);
});

test('putMessage works',async()=>{
    const messages = await Message.find({});
    const messageToUpdate=messages[0];
    messageToUpdate.text="putWorks"
    const id= messages[0]._id;
    await api.put(process.env.API_MAINENDPOINT+`message/${id}`)
    .send(messageToUpdate)
    .expect(200);

    const thisIdNotExist = "62488c3da0f2dc4c561e292a";
    await api.put(process.env.API_MAINENDPOINT+`message/${thisIdNotExist}`)
    .send(messageToUpdate)
    .expect(404);

    await api.put(process.env.API_MAINENDPOINT+`message/${1234}`)
    .expect(400);

    const messagesAfter = await Message.find({});
    expect(messagesAfter[0].text).toEqual('putWorks');
});

test('deleteMessage works',async()=>{
    const messages = await Message.find({});
    const messagesLength = messages.length;
    const messageToDelete=messages[0];
    const id = messageToDelete._id;
    await api.delete(process.env.API_MAINENDPOINT+`message/${id}`)
    .expect(200);

    const thisIdNotExist = "62488c3da0f2dc4c561e292a";
    await api.delete(process.env.API_MAINENDPOINT+`message/${thisIdNotExist}`)
    .expect(404);

    await api.delete(process.env.API_MAINENDPOINT+`message/${1234}`)
    .expect(400);

    const messagesAfter = await Message.find({});
    expect(messagesAfter).toHaveLength(messagesLength-1);
    expect(messagesAfter).not.toContain(messageToDelete);
});
}),

    // --- CHAT --- //

describe('Chat', () => {
    test('there are chats', async()=>{
        const response =await Chat.find({})
        expect(response.body).length==initialChats.length;
    });

test('getAll works',async()=>{
    const chats = await Chat.find({});
    await api.get(process.env.API_MAINENDPOINT+`chat/`)
    .expect(200);

    expect(chats).toHaveLength(initialChats.length);
});

test('getById works',async()=>{
    const chats = await Chat.find({});
    const id= chats[0]._id;
    await api.get(process.env.API_MAINENDPOINT+`chat/${id}`)
    .expect(200);

    const thisIdNotExist = "62488c3da0f2dc4c561e292a";
    await api.get(process.env.API_MAINENDPOINT+`chat/${thisIdNotExist}`)
    .expect(404);

    await api.get(process.env.API_MAINENDPOINT+`chat/${1234}`)
    .expect(400);
});

test('putChat works',async()=>{
    const chats = await Chat.find({});
    const chatToUpdate=chats[0];
    const id= chats[0]._id;
    await api.put(process.env.API_MAINENDPOINT+`chat/${id}`)
    .send(chatToUpdate)
    .expect(200);

    const thisIdNotExist = "62488c3da0f2dc4c561e292a";
    await api.put(process.env.API_MAINENDPOINT+`chat/${thisIdNotExist}`)
    .send(chatToUpdate)
    .expect(404);

    await api.put(process.env.API_MAINENDPOINT+`chat/${1234}`)
    .expect(400);

});

test('deleteChat works',async()=>{
    const chats = await Chat.find({});
    const chatsLength = chats.length;
    const chatToDelete=chats[0];
    const id = chatToDelete._id;
    await api.delete(process.env.API_MAINENDPOINT+`chat/${id}`)
    .expect(200);

    const thisIdNotExist = "62488c3da0f2dc4c561e292a";
    await api.delete(process.env.API_MAINENDPOINT+`chat/${thisIdNotExist}`)
    .expect(404);

    await api.delete(process.env.API_MAINENDPOINT+`chat/${1234}`)
    .expect(400);

    const chatsAfter = await Chat.find({});
    expect(chatsAfter).toHaveLength(chatsLength-1);
    expect(chatsAfter).not.toContain(chatToDelete);
});
}),

afterAll(()=>{
    mongoose.connections.forEach((x)=>x.close());
});