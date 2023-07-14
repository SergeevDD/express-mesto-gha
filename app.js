const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const NotFoundError = require('./errors/not-found-err');
const {
  PORT = 3000,
  DB_URI = 'mongodb://localhost:27017/mestodb'
} = process.env;

const app = express();
app.use(express.json());
mongoose.connect(DB_URI, {
  family: 4
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30).email(),
    password: Joi.string().required().min(2),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30).email(),
    password: Joi.string().required().min(2),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(http|https)\:\/\/[a-zA-Z0-9\-\.\/\_]+/)
  }).unknown(true),
}), createUser);

app.use(cookieParser());
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.use('/404', () => { throw new NotFoundError('E R R O R 4 0 4') });
app.use('*', () => { throw new NotFoundError('Запрошен несуществующий роут') });

app.use(errors());
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
