import { Router } from "express";
import { profileRouter } from "./profileRoute";

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/articles', articleRouter);
mainRouter.use('/journals', journalRouter);
mainRouter.use('/profiles', profileRouter);

export { mainRouter };