import { Request } from "express";

enum Role {
    Mahas = 'Mahasiswa',
    Dosen = 'Dosen',
    Pembimbing = 'Pembimbing'
}

export interface AuthenticatedRequest extends Request {
    email?: string;
    role?: Role;
}

export interface Article {
    id: string;
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string | Date;
    content: string;
    bookmarkCount?: number;
}

export interface Country {
    name: {
        common: string;
    };
}

export interface User {
    username: string;
    email: string;
    password: string;
}
