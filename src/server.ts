import express from 'express';
import { AppDataSource } from './data-source';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import { logToFile } from './lib/logger';
import orderRoutes from './routes/orderRoutes';
import { errorHandler } from './lib/handler';
import cookieParser from 'cookie-parser'

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);


// Initialize TypeORM data source
AppDataSource.initialize()
  .then(() => {


    console.log('Running as user:', process.env.USERNAME)
    console.log('Database connected successfully');
    // Routes
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);
    app.use('/product', productRoutes);
    app.use('/order', orderRoutes);
    
    // Start the server
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.log('Error during DataSource initialization:', error);
  });
