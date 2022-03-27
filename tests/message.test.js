const supertest = require('supertest');
require('../src/index');
const mongoose = require("mongoose");
const Message = require('../src/models/message');
const app = require('../src/app');

const api = supertest(app);

const initalMessages = [{
    _id:"6240ca631d96533689250ae0",
    text : "Hello",
    author : "6240ca2d979f14638d359a29",
    chat : "6240ca3cc8e3bae427c75cc4"
},{
    _id : "6240cab4bb113bb56ebb0b27",
    text : "GoodBye",
    author : "6240ca2d979f14638d359a29",
    chat : "6240ca3cc8e3bae427c75cc4"
}]

beforeEach(async() =>{
    await Message.deleteMany({});
    const m1 = Message(initalMessages[0]);
    await m1.save();
    const m2 = Message(initalMessages[1]);
    await m2.save();
})

test('not found', async()=>{
    await api
    .get('/')
    .expect(404)
})

test('there are messages', async()=>{
    const response =await Message.find({})
    expect(response.body).length==2;
})

afterAll(()=>{
    mongoose.connection.close();
})