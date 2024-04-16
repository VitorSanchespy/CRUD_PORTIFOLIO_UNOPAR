const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/db');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
// connect mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ApiUserGen').then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
});

//rotas 
app.get('/', (req, res)=>{
    res.status(200).json({msg:'Bem vindo a API!'})
})

// rota todos os usuarios
app.get('/allUsers', async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.status(200).json({ allUsers: allUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao buscar usuários' });
    }
});
// rota buscar usuario por id
app.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById({_id:id});
        res.status(200).json({ user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao buscar usuário' });
    }
});
// rota para criar novo usuario
app.post('/newUser', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword
        });
        res.status(201).json('Usuário criado com sucesso');
    } catch (error) {
        console.error(error);
        res.status(500).send('Houve um erro ao criar usuário');
    }
});
// rota para deletar usuario
app.delete('/deleteUser/:id', async (req, res)=>{
    try{
        const id = req.params.id
        await User.deleteOne({_id:id})
        res.status(200).json('Usuário deletado com sucesso');
    }catch (error) {
        console.error(error);
        res.status(500).send('Houve um erro ao deletar usuário');
    }
})

// rota para atualizar usuario
app.put('/updateUser/:id', async (req, res)=>{
    try{
        const id = req.params.id
        const { name, email, phone, password } = req.body;
        await User.findByIdAndUpdate({_id:id},{
            name: name,
            email: email,
            phone: phone,
            password: password
        })
        res.status(200).json('Usuário atualizado com sucesso');
    }catch (error) {
        console.error(error);
        res.status(500).send('Houve um erro ao atualizar usuário');
    }
})

// Encerrando servidor
const PORT = process.env.PORT || 27070
app.listen(PORT, () => {
    console.log(`Servidor em execução na porta http://localhost:${PORT}`);
})