import express = require('express');
import bodyParser = require("body-parser");
import { Projeto } from '../common/projeto';
import { RepositorioDeProjetos } from './RepositorioDeProjetos';
import { Email } from '../common/Email'
import { EmailSenderService } from './EmailSenderService'

const LISTEN_PORT = 3000;

var repositorioDeProjetos: RepositorioDeProjetos = new RepositorioDeProjetos();

var tntserver = express();

var allowCrossDomain = function (req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
tntserver.use(allowCrossDomain);

tntserver.use(bodyParser.json());

tntserver.post('/email/send', async (request, response) => {
    const { sender, recipient, subject, content } = request.body;
    const bodyComplete = sender && recipient && subject && content;
    if (bodyComplete) {
        const email = new Email(sender, recipient, subject, content);
        const emailSender = new EmailSenderService();
        try {
            await emailSender.execute(email)
            response.sendStatus(200);
        }
        catch (error) {
            response.send({ message: `unexpected error occured: ${error}` });
        }
    }
    else {
        response.send({ message: 'missing information in body' })
    }

});

tntserver.listen(LISTEN_PORT, () => {
    console.log('🚀 Server is Running...')
});

tntserver.get('/projetos', function (req: express.Request, res: express.Response) {
    res.send(JSON.stringify(repositorioDeProjetos.getProjetos()));
})

tntserver.post('/projeto', function (req: express.Request, res: express.Response) {
    var projeto: Projeto = <Projeto> req.body;
    projeto = repositorioDeProjetos.adicionarProjeto(projeto);
    if (projeto) {
      res.send({"success": "O projeto foi cadastrado com sucesso"});
    } else {
      res.send({"failure": "O projeto não pode ser cadastrado"});
    }
})


tntserver.put('/projeto', function (req: express.Request, res: express.Response) {
    var projeto: Projeto = <Projeto> req.body;
    projeto = repositorioDeProjetos.arquivarProjeto(projeto);
    if (projeto) {
      res.send({"success": "O projeto foi arquivado com sucesso"});
    } else {
      res.send({"failure": "O projeto não pode ser arquivado"});
    }
})

tntserver.delete('/projetos/:nome', function (req: express.Request, res: express.Response) {
    var nome: string = req.params.nome;
    var projeto: Projeto = repositorioDeProjetos.removerProjeto(nome);
  
    if (projeto) {
        res.send({"success": "O projeto foi deletado com sucesso"});
    } else {
        res.send({"failure": "O projeto não pode ser deletado"});
    }
})

var server = tntserver.listen(LISTEN_PORT, ()=>{
  console.log('🚀 Server is Running...')
});

function closeServer(): void {
  server.close();
}


export { server, closeServer }
