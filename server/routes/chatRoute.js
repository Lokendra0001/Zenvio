const { Router } = require('express');
const route = Router();
const checkAuthentication = require('../middlewares/auth');


const { handleSendMessage, handleGetHistory, handleAddHistory } = require('../controller/chat');


route.post("/sendMessage", handleSendMessage);


route.get('/getHistory', checkAuthentication, handleGetHistory)

route.post('/addHistory', checkAuthentication, handleAddHistory);


module.exports = route;
