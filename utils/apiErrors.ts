
class ApiErrors extends Error{
    private status:string;
    constructor(message:string, private statusCode:number){
        super(message);
        this.status = `${this.statusCode}`.startsWith('4')? 'User Side Error': 'Internal Server Error'
    }
}
export default ApiErrors;