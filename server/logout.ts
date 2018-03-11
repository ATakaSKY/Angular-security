import { Request, Response } from "express";
import { sessionStore } from "./session-store";


export function logoutUser(req: Request, res: Response) {

    const sessionId = req.cookies['SESSIONID'];

    const user = sessionStore.clearSession(sessionId);

    res.clearCookie('SESSIONID');

    res.status(200).json({ });
}