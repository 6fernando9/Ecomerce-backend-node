//message, status code, error codes,
//como un Dto de error
export class HttpException extends Error{
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCode;

    constructor(message: string,errorCode: any, statusCode: number,error: any){
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = error;
    }


}
//un enum de codigos de error
export enum ErrorCode{
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORREC_PASSWORD = 1003,
    UNPROCESABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001,
    UNAUTHORIZED = 4001,
    PRODUCT_NOT_FOUND = 5001,
    ADDRESS_NOT_FOUND = 1004,
    ADDRESS_DOES_NOT_BELONG = 1005,
    CART_NOT_FOUND = 404,
    ORDER_NOT_FOUND = 404

}