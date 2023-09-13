export class createOnData {
    public floors = false
    public entities = false

    onDataCome(fps: number, func: () => void){
        new Promise<void>((resolve) => {
            const waitInterval = setInterval(() => {
                if( this.floors && this.entities ){
                    clearInterval(waitInterval)
                    resolve()
                }
            }, 1000 / fps)
        }).then(func)
    }
}