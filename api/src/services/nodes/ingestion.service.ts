export class IngestionService{
    constructor(){}

    async ingestion(data: object){
        try{
            console.log('data', data);
        }catch(error){
            throw error;
        }
    }
}