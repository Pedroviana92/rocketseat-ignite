const express = require('express');

const app = express();


app.post('/courses', (req, res)=> {
    return res.json(
        {
            cursos: ['curso 1', 'curso 2', 'curso 3']
        }
    )
})

app.listen('3050');

