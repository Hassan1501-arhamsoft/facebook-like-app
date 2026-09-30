import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import loggerMiddleware from "./middlewares/logger.middleware.js";
import postRoutes from './routes/post.routes.js';
import likeRoutes from './routes/like.routes.js';
import commentRoutes from './routes/comment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import followRoutes from "./routes/follow.routes.js";
import messageRoutes from "./routes/message.routes.js";
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const app = express();
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Network API',
      version: '1.0.0',
      description: 'API documentation for the Facebook-like social application',
    },
    servers: [
      { url: 'http://localhost:5000' } 
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }] 
  },
  apis: ['./src/routes/*.js', './routes/*.js'], 
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes)
app.use("/api/posts", postRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorMiddleware);

export default app;