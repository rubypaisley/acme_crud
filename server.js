const app = require('./app');
const db = require('./db');
db.syncAndSeed();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening in port ${PORT}`));

