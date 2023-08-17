import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    //Aqui ele pega o contexto e este contexto tem a: Response. Para manipular a resposta enviada;
    const response = ctx.getResponse<Response>();
    //getResponse é do Express(FrameWork para Node.js) por isso pode usar o Promise <>;

    const status = exception.getStatus();
    //Aqui ele irá pegar somente o status da sessão;
    const exceptionResponse = exception.getResponse();
    // O que está sendo respondido de fato nessa exception;

    const error = typeof response === 'string' ? { message: exceptionResponse } : (exceptionResponse as object);

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
    });
  }
}
