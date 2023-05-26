import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as ngrok from 'ngrok';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsArr = [];

        errors.forEach((error) => {
          const errorsMessagesKeys = Object.keys(error.constraints);

          errorsMessagesKeys.forEach((key) => {
            errorsArr.push({
              message: error.constraints[key],
              field: error.property,
            });
          });
        });

        throw new BadRequestException(errorsArr);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);

  const url = await ngrok.connect({
    addr: 3000,
    authtoken: '2OPMnc3FfbEdG34Y9mqTx8kfozH_55JBj7CAq4oAGnkj5hGfX',
  });
  console.log(`Ngrok URL: ${url}`);
}
bootstrap();
