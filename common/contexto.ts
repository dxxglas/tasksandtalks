export class Contexto {
    mensagem: string;
    lembrete: Date;
    lido: boolean;
    atencao: boolean;
    snoozing: boolean;

    constructor() {
        this.mensagem = '';
        this.lembrete = null;
        this.lido = false;
        this.atencao = false;
        this.snoozing = false;
    }
}