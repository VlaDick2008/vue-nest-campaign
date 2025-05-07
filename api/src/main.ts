import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "reflect-metadata";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("api");
	app.enableCors({
		origin: ["http://localhost:8080", "http://localhost:5173"],
		credentials: [true],
	});
	await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
