const socket = io(); 

socket.on('products', (products) => {
    const productHtml = products
      .map((product) => `
        <tr>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td><img src=${product.url} width="50" height="50"></td>
        </tr>
      `)
      .join(' ');
  
    document.getElementById('tbody').innerHTML = productHtml;
  });

const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const url = document.getElementById('url').value;
  const product = { title, price, url };
  socket.emit('newProduct', product);
});

socket.on('mensajes', (mensajes) => {
    const mensajeHtml = mensajes
      .map((mensaje) => `
        <tr>
            <td style="color:blue;font-weight:bold">${mensaje.email}</td>
            <td style="color:brown;font-weight:bold">${mensaje.mensaje}</td>
            <td style="color:green;font-style:italic">${mensaje.fhora}</td>
        </tr>
      `)
      .join(' ');
  
    document.getElementById('tbodym').innerHTML = mensajeHtml;
  });

const form2 = document.getElementById('form2');

form2.addEventListener('submit', (event) => {
  event.preventDefault();

  const fh = new Date();
  const fhora = fh.getDate()+'/'+(fh.getMonth()+1)+'/'+fh.getFullYear()+' '+fh.getHours()+':'+fh.getMinutes()+':'+fh.getSeconds();

  const email = document.getElementById('email').value;
  const msg = document.getElementById('mensaje').value;
  const mensaje = { email, msg, fhora };
  socket.emit('newMensaje', mensaje);
});