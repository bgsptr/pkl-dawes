import { CookieOptions, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import generateHashedPassword from "../utils/hashPassword";
import multer from "multer";
import { AuthService } from "../internal/services/AuthService";


export class AuthenticationHandler {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  loginAccount = async (req: Request, res: Response): Promise<any> => {

    if (!req.cookies) {
      return res.status(400).json({ error: "error 400" });
    }
    
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken } = await this.authService.login(email, password);

      const cookieOption: CookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const hashedRefreshToken = await generateHashedPassword(10, refreshToken);

      console.log(hashedRefreshToken);

      // await this.loginService.updateUserRefreshToken(email, hashedRefreshToken);
    
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json({
          status: true,
          message: "login successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

    } catch (error: any) {
      if (error.message === 'EmailNotFound') {
        return res.status(404).json({
          status: false, 
          error: "Email not found",
        });
      } else if (error.message === 'EmailAndPasswordNotMatch') {
        return res.status(404).json({
          status: false, 
          error: "Email and password you inputted doesn't match",
        });
      } else {
        return res.status(400).json({
          status: false, 
          error: error.message
        });
      }
    }
  }

  registerAccount = async (req: Request, res: Response): Promise<any> => {
    const { email, username, password, confirmPassword } = req.body;

    try {
      if (password !== confirmPassword) return res.status(400).json({ error: true, message: "password and confirmed password not match" });

      await this.authService.register(email, username, password, confirmPassword);

      return res.status(201).json({
        success: true,
        message: 'success registered',
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(404).json({
          success: false,
          message: "Username or email already registered",
        });
      }
      else {
        const errorMsg = JSON.parse(error.message);

        console.log(errorMsg);

        return res.status(422).json({
          status: false,
          message: "Validation error when create new account",
          errors: errorMsg,
        });
      }
    }
  }

  useRefreshToken = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const refresh_token = req.cookies.refreshToken;
    const { email } = req;
    const { expiredDate } = req.body;
  
    if (!email) {
      return res.status(401).json({ error: true, message: 'User not authorized' });
    }
  
    if (!refresh_token) {
      return res.status(403).json({ error: true, message: 'No refresh token provided. Please log in again.' });
    }
  
    try {
      // const tokenObject = await this.refreshTokenService.fetch(email, refresh_token, expiredDate);
      // const { newAccessToken, expiredNewAccToken, comparedToken } = tokenObject;
  
      // if (!comparedToken) {
      //   return res.status(404).json({ error: true, message: 'Refresh token does not match' });
      // }
  
      // await this.refreshTokenService.updateRefreshTokenInDB(email, refresh_token);
  
      return res.status(200).json({
        error: false,
        message: 'Successfully refreshed token',
        // accessToken: newAccessToken,
        // expiredDate: expiredNewAccToken,
      });
    } catch (error: any) {
      return res.status(500).json({
        error: true,
        message: `internal server error, ${error.message}`,
      });
    }
  };

  registerNewEntity = async (req: AuthenticatedRequest, res: Response) => {
    const { role, instanceName } = req.body;
    const { email, file } = req;

    
  }
}  