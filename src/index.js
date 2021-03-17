const express = require('express');
const { v4: uuid } = require('uuid')

const app = express();
app.use(express.json())

const customers = [];

//Middleware

function verifyExistsAccountCPF(req, res, next) {
    const { cpf }  = req.headers
    const customer = customers.find((customer) => customer.cpf === cpf)

    if(!customer) {
        return res.status(400).json({
            error: 'Customer not found'
        })
    }
    req.customer = customer

   return next()
}


app.post('/account', (req, res)=> {
    const {cpf, name} = req.params
    
    const CustomerAlreadyExists = customers.some((customer)=> customer.cpf === cpf)

    if(CustomerAlreadyExists) {
        res.status(400).send({
            error: "Customer already exists"
        })
    }

    customers.push({
        cpf,
        name,
        id: uuid(),
        statement: []
    })
    return res.status(201).send('Conta criada');
})

app.get('/statement', verifyExistsAccountCPF ,(req, res)=> {
    const { customer } = req
    return res.json(customer.statement)
})

app.post('/deposit', verifyExistsAccountCPF, (req, res)=> {
    const { description, amount } = req.body

    const{ customer } = req

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    }
    customer.statement.push(statementOperation)

    return res.status(201).send()
})
app.listen('3050');

