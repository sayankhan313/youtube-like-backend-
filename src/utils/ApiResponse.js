class ApiResponse{
    constructor(statuseCode,data,message="Success"){
        this.statuseCode = statuseCode;
        this.data = data;
        this.success =statuseCode <400;
        this.message = message;
    }
}
export {ApiResponse};