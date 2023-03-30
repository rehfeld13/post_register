const express = require('express')
const path = require('path')
const fs = require('fs')

const app =  express()

// definindo o template engine(Já define os arquivos estáticos automaticamente)
app.set('view engine','ejs')


// definindo os arquivos estátcos
//app.use(express.static(path.join(__dirname,'views')))

// definindo os arquivos publicos
app.use(express.static(path.join(__dirname,'public')))

// habilita server para receber dados via POST de um formulario
app.use(express.urlencoded({extended:true}))


//Rota página inicial
app.get('/', (req, res)=>{
  res.render('index',{
    title: 'Rafael Rehfeld - Home'
  })
})

// Rota para salvar dados do form
app.post('/salvar-post', (req,res)=>{
  const {title, text} = req.body

  const data = fs.readFileSync('./store/posts.json')
  const posts = JSON.parse(data)

  posts.push({
    title,
    text
  })

  const postsString = JSON.stringify(posts)

  fs.writeFileSync('./store/posts.json', postsString)

  res.redirect('/cadastro-posts?c=1')
})

// Rota para cadastrar dados do form
app.get('/cadastro-posts', (req,res)=>{
  console.log(req.query)
  const { c } = req.query
  
    res.render('cadastro-posts',{
      title: 'Rafael Rehfeld - Cadastro de Posts',
      cadastrado: c
    })
})

//Rota para mostrar os posts salvos
app.get('/posts', (req, res)=>{
  const date = fs.readFileSync('./store/posts.json')
  const dateJson = JSON.parse(date)

  res.render('posts',{
    title: 'Rafael Rehfeld - Posts',
    posts: dateJson,

    })
  })


//404 error(not found)
app.use((req,res)=>{ // middleware
  res.send('Página não encontrada!')
})


// executando o servidor
const port = process.env.PORT || 8080
app.listen(port,()=>{
  console.log(`Server is listening on port ${port}`)
})