const path = require('path');
const express = require('express');
const routes  = require('./routes')
const cors = require('cors');
const { errors }  = require('celebrate');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());

const PORT = process.env.PORT || 3333;
app.listen(PORT);