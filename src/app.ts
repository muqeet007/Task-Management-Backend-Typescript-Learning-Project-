import express,{Express} from 'express';
import prisma from './prisma.js';
import config from './config/config.ts';


const app = express() as Express;

export default app