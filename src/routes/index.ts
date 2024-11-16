import { Router } from 'express'
import { authentication } from '../middlewares/authentication';
import authRouter from './auth';
import profileRouter from './profile';
import categoryRouter from './category';
import productRouter from './product';
import cartRouter from './cart';
import transactionRouter from './transaction';
import chatRouter from './chat';

const router = Router();

router.get('/', (req, res) => {
    res.send('ROOT ROUTER Express APP')
});

router.use("/auth", authRouter);
router.use("/profile", authentication, profileRouter)
router.use("/category", authentication, categoryRouter)
router.use("/product", authentication, productRouter)
router.use("/cart", authentication, cartRouter)
router.use("/transaction", authentication, transactionRouter)
router.use("/complain", authentication, chatRouter)

export default router