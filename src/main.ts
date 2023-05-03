import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as ngrok from 'ngrok';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(3000);

  const url = await ngrok.connect({
    addr: 3000,
    authtoken: '2OPMnc3FfbEdG34Y9mqTx8kfozH_55JBj7CAq4oAGnkj5hGfX',
  });
  console.log(`Ngrok URL: ${url}`);
}
bootstrap();
