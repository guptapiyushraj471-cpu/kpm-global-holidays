const app = require('./server');
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening ${port}`));
