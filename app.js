const express = require('express');
const mongoose = require('mongoose');
const sendError = require('./utils/errors');
const { login, createUser } = require('./routes/users');
const {
  PORT = 3000,
  DB_URI = 'mongodb://localhost:27017/mestodb'
} = process.env;

const app = express();
app.use(express.json());
mongoose.connect(DB_URI, {
  family: 4
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('*', function () { throw new NotFoundError('Был запрошен несуществующий роут'); });
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту : ${PORT}`)
})
