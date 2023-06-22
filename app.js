const express = require('express');
const mongoose = require('mongoose');
const sendError = require('./utils/errors')
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/mestodb ', {
  family: 4
});
//Временное решение для авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '64947aeef18969415817e3e1'
  };
  next();
});
///////////////////////////////
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('*',function(req, res) { sendError(res,{name:'CastError'}) });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту : ${PORT}`)
})
