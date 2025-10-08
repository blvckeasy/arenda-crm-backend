import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  AccessTokenService,
  CoreCreditorService,
  UserRoles,
  AuthorizationError,
  CorePasswordService,
  IncorrectPasswordError,
  Prisma,
  GoogleParsedToken,
  CreditorStatus,
  Creditor,
} from '@blvckeasy/arenda-crm-core';
import { ConfigService } from '@nestjs/config';
import { SignInAdminDto, SignUpAdminDto } from './dto';

@UseInterceptors(CacheInterceptor)
@Controller('auth')
export class AuthController {
  services: { [key: string]: CoreCreditorService };

  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly coreCreditorService: CoreCreditorService,
    private readonly corePasswordService: CorePasswordService,
  ) {
    this.services = {
      [UserRoles.CREDITOR]: this.coreCreditorService,
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const redirectBaseUrl = this.configService.get<string>(
      'FRONTEND_SERVER_GOOGLE_AUTH_CALLBACK_URL',
    );
    const result = await this.authService.handleGoogleLogin(req.user);
    const googleToken = await this.accessTokenService.sign(result);
    const redirectUrl = `${redirectBaseUrl}?token=${googleToken}`;

    return res.redirect(redirectUrl);
  }

  @Post('signin')
  async signIn(@Body() body: SignInAdminDto) {
    const { username, password, googleToken, userRole } = body;

    const findOptions: { username?: string; email?: string } = {};

    if (username) {
      findOptions.username = username;
    }

    if (googleToken) {
      const payload = await this.accessTokenService.verify(googleToken);
      findOptions.email = payload.email;
    }
    
    const service = this.services[userRole];

    const creditor = await service.getByUnique(
      findOptions as Prisma.CreditorWhereUniqueInput,
    );

    if (!creditor) {
      throw new AuthorizationError('Client not found');
    }

    if (password) {
      const isPasswordValid = await this.corePasswordService.comparePassword(
        password,
        creditor.password,
      );

      if (!isPasswordValid) {
        throw new IncorrectPasswordError();
      }
    }

    const access_token = await this.generateAccessToken(creditor, userRole);

    const { password: _, ...result } = creditor;
    return {
      data: result,
      token: {
        access_token,
      },
    };
  }

  @Post('signup')
  async signUp(
    @Body() body: SignUpAdminDto,
  ) {
    const { username, password, googleToken, userRole } = body;
    const service = this.services[userRole];

    const { data: googleUser } = await this.accessTokenService
      .verify(googleToken) as GoogleParsedToken;

    const newCreditor = await service.create({
      username,
      email: googleUser.email,
      firstname: googleUser.firstName,
      lastname: googleUser.lastName,
      googlePhotoUrl: googleUser.picture,
      status: CreditorStatus.CONFIRMED,
      password,
    });

    const access_token = await this.generateAccessToken(newCreditor, userRole);

    const { password: _, ...result } = newCreditor;
    return {
      data: result,
      token: {
        access_token,
      },
    };
  }

  async generateAccessToken(user: Creditor, userRole: UserRoles) {
    const access_token = await this.accessTokenService.sign({ id: user.id, role: userRole });
    return access_token;
  }
}
