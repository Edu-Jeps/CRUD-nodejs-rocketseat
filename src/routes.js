import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto';

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search, 
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            // validando se os campos de title e/ou description estão presentes

            const updateFields = {}

            if (title !== undefined) {
                updateFields.title = title 
            } else {
                return res.writeHead(400).end(JSON.stringify({ error: "titulo é um campo obrigatorio!"}))

            }

            if (description !== undefined) {
                updateFields.description = description 
            } else {
                updateFields.description = null
            }
            

            // se estiver vazio os dois retornar mensagem de erro
            if (Object.keys(updateFields).length ===0 ){
                return res.writeHead(400).end(JSON.stringify({ error: "nenhum dos campos foram preenchidos!"}))
            }

            const task = {
                id: randomUUID(),
                ... updateFields, 
                completed_at: null,
                created_at: new Date().toISOString(), 
                updated_at: new Date().toISOString(),
            }

            database.insert('tasks', task)
            
            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const id = req.params.id
            const { title , description } = req.body

            // validando se os campos de title e/ou description estão presentes

            const updateFields = {}

            if (title !== undefined) updateFields.title = title 
            if (description !== undefined) updateFields.description = description

            // se estiver vazio os dois retornar mensagem de erro
            if (Object.keys(updateFields).length ===0 ){
                return res.writeHead(400).end(JSON.stringify({ error: "nenhum dos campos foram preenchidos!"}))
            }

            try{
                database.update('tasks', id,{ ...updateFields, updated_at: new Date().toISOString()})
                
                return res.writeHead(204).end()
            } catch (erro) {
                return res.writeHead(404).end(JSON.stringify({error: erro.message}))
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {

            const id = req.params.id
            
            try{ 
                database.delete('tasks', id)
                
                return res.writeHead(204).end()
            } catch (erro) {
                return res.writeHead(404).end(JSON.stringify({error: erro.message}))
            }
        }
    },
]