import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, authDocument } from 'src/schema/auth.schema';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<authDocument>,
    private jwtService: JwtService,
  ) {}

  
  async register(createAuthDto: CreateAuthDto) {
    const { username, email, password } = createAuthDto;
    
    const existingUser = await this.authModel.findOne({ email });
  
    const existingUsername = await this.authModel.findOne({ username })

    if (existingUsername) {
      throw new BadRequestException("Username already exists")
    }

    const verification_code = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL as string,
        pass: process.env.APP_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Online shop verification Code',
      text: `Your verification code is: ${verification_code}`,
    };
  
    if (existingUser) {
      if (existingUser.is_verify) {
        throw new BadRequestException('User already exists');
      }
  
      await transporter.sendMail(mailOptions);
  
      await this.authModel.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            verification_code,
            password: hashedPassword, 
            username,                 
          },
        },
      );
  
      setTimeout(async () => {
        await this.authModel.updateOne(
          { _id: existingUser._id },
          { $set: { verification_code: null } },
        );
      }, 180000); // 3 daqiqa
  
      return { message: 'Verification code resent. Please verify your email.', _id: existingUser._id};
    }
  
    await transporter.sendMail(mailOptions);
  
    const newUser = new this.authModel({
      username,
      email,
      password: hashedPassword,
      verification_code,
    });
  
    const savedUser = await newUser.save();
  
    setTimeout(async () => {
      await this.authModel.updateOne(
        { _id: savedUser._id },
        { $set: { verification_code: null } },
      );
    }, 180000); 
  
    return { message: 'Successfully registered. Please verify email.', _id: savedUser._id };
  }
  

  async verify(code: number, id: string) {
    if (!code || code.toString().length !== 6) {
      throw new BadRequestException('Not a 6-digit number');
    }

    const user = await this.authModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found, please register');
    }

    if (user.verification_code === null) {
      throw new BadRequestException(
        'Your verification code is expired. Please resend.',
      );
    }

    if (user.verification_code != code) {
      throw new BadRequestException('Your verification code is incorrect.');
    }

    await this.authModel.findByIdAndUpdate(id, {
      is_verify: true,
      verification_code: null,
    });

    return { message: 'Successfully verified' };
  }

  async login(updateAuthDto: UpdateAuthDto, res: Response) {
    const { email, password } = updateAuthDto;

    const user = await this.authModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found, please register');
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    if (!user.is_verify) {
      throw new BadRequestException('Your account is not verified');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  }

  async forgetPasswordSendMessage(email:string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.authModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found, please register');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    const resetLink = `${process.env.DOMAIN}/auth/forget_password/${user._id}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Online Shop - Password Reset',
      html: `
        <h1>Click the link below to reset your password</h1>
        <a href="${resetLink}">Reset Password</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    await this.authModel.findByIdAndUpdate(user._id, { is_verify: false });

    return {
      message: 'A message has been sent to your email, please check.',
    };
  }

  async forgetPassword(updateAuthDto: UpdateAuthDto, id: string) {
    const { new_password } = updateAuthDto;

    if (!new_password) {
      throw new BadRequestException('New password is required');
    }

    const user = await this.authModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found, please register');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await this.authModel.findByIdAndUpdate(id, {
      password: hashedPassword,
      is_verify: true,
    });

    return { message: 'Successfully changed password' };
  }

  async renameUserData(updateAuthDto: UpdateAuthDto, id: string) {
    const { username, new_password, old_password } = updateAuthDto;

    const user = await this.authModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let updatedFields: Partial<authDocument> = {};
    let returnMessage = '';

    if (username) {
      updatedFields.username = username;
      returnMessage += 'username ';
    }

    if (old_password && new_password) {
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (isMatch) {
        updatedFields.password = await bcrypt.hash(new_password, 10);
        returnMessage += 'password ';
      } else {
        throw new BadRequestException('Old password is incorrect');
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      return { message: 'No information found for update' };
    }

    await this.authModel.findByIdAndUpdate(id, updatedFields);

    return { message: 'Updated: ' + returnMessage.trim() };
  }

  async deleteAccount(id: string) {
    const user = await this.authModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.authModel.findByIdAndDelete(id);

    return { message: 'Deleted user' };
  }

  async logout(id: string, req: Request) {
    const res = req.res as Response;
    res.clearCookie('token');

    return { message: 'Logged out' };
  }
}
