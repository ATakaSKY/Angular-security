import { Request, Response } from "express";
import { sessionStore } from "./session-store";
import {db} from './database';
import * as argon2 from 'argon2';
import { DbUser } from "./db-user";
import { randomBytes } from "crypto";

export function loginUser(req: Request, res: Response) {

    const user = db.findUserByEmail(req.body.email);

    if(!user){
        res.sendStatus(403);
    }else{
         loginAndBuildResponse(req.body.email,req.body.password,res);
    } 
}

async function loginAndBuildResponse(password,user,res){
    
    try{
         const sessionId =  await matchPasswordFindUser(password,user);
         res.cookie('SESSIONID',sessionId,{httpOnly:true, secure:true});

         console.log('Login successfull');
        res.status(200).json({ id: user.id, email: user.email });
    }
    catch(err){
        res.sendStatus(403);
    }

}

async function matchPasswordFindUser(password,user:DbUser){

    const verify = await argon2.verify(user.passwordDigest, password);

    if(!verify){
        throw new Error('Invalid Password');
    }else{
        const sessionId = await randomBytes(32).readUInt8(2).toString();

         sessionStore.createSession(sessionId,user);

         return sessionId;
    }

}

