const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    validate: {
      validator: (u) => isURL(u, {
        require_valid_protocol:true,
        protocols: ['http','https'],
      }),
      message: 'Неверный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Проверьте формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    select: false
  }
});

module.exports = mongoose.model('user', userSchema);