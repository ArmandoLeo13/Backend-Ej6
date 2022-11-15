const express = require('express');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');

const productList = [];

app.get('/', (req, res) => {

  res.render('pages/index');
});

app.post('/productos', (req,res) =>{
    productList.push(req.body);
    console.log(productList);
    res.redirect('/');
});

app.get('/productos', (req,res)=>{
    res.render('pages/productos', {productList});
})




const PORT = 8080;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));