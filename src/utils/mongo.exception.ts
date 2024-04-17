import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { MongoServerError } from 'mongodb';
import * as mongoose from 'mongoose';

@Catch(mongoose.mongo.MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    let error;

    switch (exception.code) {
      case 11000: {
        if (Object.keys(exception.keyValue).toString() == 'mobileNumber') {
          error = {
            statusCode: HttpStatus.CONFLICT,
            message: 'Already Exists',
          };
        } else if (Object.keys(exception.keyValue).toString() == 'customer') {
          error = {
            statusCode: HttpStatus.CONFLICT,
            message: 'Customer MobileNumber Already Exists  ',
          };
        } else {
          error = {
            statusCode: HttpStatus.CONFLICT,
            message: 'Duplicate',
          };
        }
        break;
      }
      // case 'DocumentNotFoundError': {
      // }
      // case 'MongooseError': {
      //     break;
      // }
      // case 'ValidationError': {
      //     break;
      // }
      // case 'CastError': {
      //     break;
      // }
      // case 'DisconnectedError': { break; }
      // case 'DivergentArrayError': { break; }
      // case 'MissingSchemaError': { break; }
      // case 'ValidatorError': { break; }
      // case 'ValidationError': { break; }
      // case 'ObjectExpectedError': { break; }
      // case 'ObjectParameterError': { break; }
      // case 'OverwriteModelError': { break; }
      // case 'ParallelSaveError': { break; }
      // case 'StrictModeError': { break; }
      // case 'VersionError': { break; }
      default: {
        error = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Error',
        };
        break;
      }
    }

    response.status(error.statusCode).json(error);
  }
}
