const express = require('express');
const app = express();
app.use(express.json());
app.use((req, res) => {
  res.send({ body: req.body === undefined ? 'undefined' : req.body });
});
app.listen(4001, () => console.log('Listening'));
