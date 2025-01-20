import { RoleUser } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository {
    checkUserExist = async (email: string, username: string) => {
        return await UserRepository._prisma.user.findFirstOrThrow({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            },
        })
    }
    

    createNewAccount = async (email: string, username: string, hashedPass: string) => {
        return await UserRepository._prisma.user.create({
            data: {
              email: email,
              username: username,
              password: hashedPass,
              role: "MAHASISWA" 
            },
        });
    }

    findUserByEmail = async (email: string) => {
        return await UserRepository._prisma.user.findFirstOrThrow({
            where: {
                email: email,
            }
        })
    }



    updatePhotoProfileUser = async (email: string, imageUrl: string) => {
        return await UserRepository._prisma.user.update({
            where: {
                email: email,
            },
            data: {
                urlphoto: imageUrl,
            },
      });
    }

    updateInformationProfileUser = async (email: string, name?: string, gender?: gender_type, country?: string) => {
        return await UserRepository._prisma.user.update({
            where: {
              email: email,
            },
            data: {
              name: name,
              gender: gender,
              country: country,
            },
        });
    }

    findMatchedRefreshToken = async (email: string) => {
        return await UserRepository._prisma.user.findFirstOrThrow({
            where: {
                email: email
            },
            select: {
                refreshtoken: true
            }
        })
    }

    updateRefreshToken = async (email: string, refreshToken: string) => {
        return await UserRepository._prisma.user.update({
            data: {
                refreshtoken: refreshToken
            },
            where: {
                email: email
            }
        })
    }

    findRoleOfUser = async (email: string): Promise<{ role: RoleUser | null }> => {
        return UserRepository._prisma.user.findFirstOrThrow({
            where: { email },
            select: { role: true }
        });
    };
    
}