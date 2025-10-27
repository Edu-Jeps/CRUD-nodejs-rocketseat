import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';


const CSV_FILE = 'data.csv'; 

const API_URL = 'https://poisonous-spooky-phantasm-vqxqgwpg75q2vjw-3333.app.github.dev/tasks'; 


async function enviarTasks(task) {
    try{
        console.log(`Enviando POST para ${API_URL} com dados: ${JSON.stringify(task)}`);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        
    } catch (error) {
        console.error(`[ERRO] Ao processar a tarefa '${task.title}': ${error.message}`);
    }
}


async function importCSV() {
    console.log(`\n--- Iniciando Importação de Tasks ---`);
    console.log(`Arquivo CSV: ${CSV_FILE}`);
    console.log(`API de destino: ${API_URL}`);

    
    const fileStream = createReadStream(CSV_FILE);


    const parser = fileStream.pipe(parse({
        columns: true, // Usa a primeira linha como cabeçalho
        skip_empty_lines: true
    }));

    try {
        let count = 0;
        for await (const record of parser) {
            
            
            const taskPayload = {
                title: record.title.trim(),
                description: record.description.trim()
            };
            
            await enviarTasks(taskPayload);
            count++;
        }


    } catch (error) {
        console.error('\n--- Erro durante a leitura do CSV ---');
        console.error(error.message);
        process.exit(1);
    }
}

importCSV();
