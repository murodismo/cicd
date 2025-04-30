import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
      JwtModule.register({
        secret: process.env.JWT_SECRET, // .env ichida JWT_SECRET saqlang
        signOptions: { expiresIn: '1d' },
      }),
      // boshqa modullar...
    ],
    // providers: [...], exports: [...], etc.
  })
  export class GuardModule {}