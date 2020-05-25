
export class Icon { //Usiamo l'oggetto ScaledSize e dopo facciamo un istanza
    public scaledSize:ScaledSize;
    constructor(public url: string, size: number){
        this.scaledSize = new ScaledSize(size,size);
    }

    setSize(size: number) { //Ridimensiona l'icona
        this.scaledSize = new ScaledSize(size,size);
    }
}

export class ScaledSize { //Classe che ci da altezza e larghezza delle icone
    constructor(
    public width:  number,
    public height: number){}
}
