const http = require('http');
const fs = require('node:fs');

const server = http.createServer((req, res) => {
  
    console.log(`Request received: ${req.method} ${req.url}`);

  
    if (req.url === '/') 
   {
      const indexHtml = fs.readFileSync('index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      // read index.html, send that content to client
      
      res.end(indexHtml); 
   }

   else if (req.url === '/styles.css')
   {
      const css = fs.readFileSync('styles.css');
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(css); 
   }
   
   else if (req.url === '/1.jpeg') 
   {
      const image = fs.readFileSync('1.jpeg');
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(image);
   }
  
   else if (req.url === '/contact.html') 
   {
      const contactHtml = fs.readFileSync('contact.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(contactHtml);
   } 
   
   else 
   {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
   }
  
});

server.listen(3000, () => {
   console.log('Server running at http://localhost:3000/');
});