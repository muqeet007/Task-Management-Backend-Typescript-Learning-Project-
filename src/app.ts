import express,{Express} from 'express';
import userRoutes from './routes/user.route';


const app = express() as Express;

app.use(express.json());
app.use('/api',userRoutes);

export default app