// Do NOT modify this file; make your changes in server.js.
const { server } = require('./server.js');

const port = 5000;
server.listen(port, () => {
  console.log('Server listening on port:', port);
});
