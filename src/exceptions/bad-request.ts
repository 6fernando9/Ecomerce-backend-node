import { ErrorCode, HttpException } from "./root";

export class BadRequestException extends HttpException{
    //erroCode es el Enum
    constructor(message: string, errorCode: ErrorCode){
        super(message,errorCode,400,null);
    }
}