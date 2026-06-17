import type { IChat } from './Core/Objects/chat.js';

import { type IContent, TextContent, ImageContent, VideoContent } from './Core/Objects/message.js';
import type { IMessage } from './Core/Objects/message.js';

import { User } from './Core/Objects/user.js';
import type { IUser } from './Core/Objects/user.js';

import { Logger } from './Core/Services/logger.js';

import express from 'express'
import type { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';

import mongoose from 'mongoose';
import { UserModel, ChatModel } from './Core/Objects/db.js';

import { Server } from "socket.io";

import http from 'http';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { CommonServices } from './Core/Services/commonServices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

mongoose.connect('mongodb://localhost:27017/chat')
    .then(() => Logger.event("Connected to MongoDB: chat database"))
    .catch(err => Logger.error("DB Connection Error:", err));

interface ServerToClientEvents {
  chatMessage: (message?: IMessage) => void;
}

interface ClientToServerEvents {
  sendMessage: (message: string, senderName: string, senderId: number) => void;
  selectChat: (chatId: number) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 16e6
});

const sessionMiddleware = session({
  secret: '^donkey$Kong&88221',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
});

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(sessionMiddleware);

io.use((socket, next) => {
  sessionMiddleware(socket.request as any, {} as any, next as any);
});

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && (req.session as any).userId) {
    next();
  } else {
    res.redirect(`/auth?redirectTo=${req.originalUrl}`)
  }

};

// reserved
app.get('/', (req, res) => {
  res.send('Main reserved page')
})

// main page
app.get('/chat', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "./html/index.html"));
})

// auth HTML page
app.get('/auth', (req, res) => {
  res.send(`
    <form action="/auth" method="POST">
      <input name="userName" placeholder="Username" required>
      <input name="password" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

// to auth
app.post('/auth', express.urlencoded({ extended: true }), async (req, res) => {
  const { userName, password } = req.body;
  
  const dbUser = await UserModel.findOne({ userName, userPassword: password });

  if (dbUser) {
    // To session
    (req.session as any).userId = dbUser.userId;
    (req.session as any).userName = dbUser.userName;
    
    // make sure that session is saved before proceeding
    req.session.save((err) => {
      if (err) Logger.error("Session save error:", err);
      const redirectTo = req.query.redirectTo as string || '/chat';
      res.redirect(redirectTo);
    });

  } else {
    res.send("Invalid credentials. <a href='/auth'>Try again</a>");
  }
});

server.listen(5000, ()=> {
    Logger.event(`Server started at port: ${5000}`)
})


io.on("connection", async (socket) => {
  const session = (socket.request as any).session;

  // valid for each individual socket
  let currentChat: IChat | null = null;
  let currentUser: IUser | null = null;

  if (session && session.userId) {
    currentUser = new User(session.userName, session.userId);
    Logger.event(`Socket ${socket.id} auto-identified as ${currentUser.get_name()}`);
  } else {
    Logger.event("Anonymous socket connected (No session found)");
  }

  socket.on("selectChat", async (chatId) => {
    
    currentChat = await CommonServices.loadChat(chatId)

    if (currentChat != null){
      Logger.event(`${currentUser?.get_name()} joined the '${currentChat.get_id()}' chat`);
      await CommonServices.fetchHistory(currentChat, socket);
    } else {
      Logger.error(`${currentUser?.get_name()} entered incorrect chat id`);
    }
    
  })

  socket.on("sendMessage", async (content: string, type: string) => {
    if (currentUser != null && currentChat != null){
      let lastId = await CommonServices.getLastMessageId(currentChat.get_id())
      let exactContent: IContent | null;

      if (type == "text"){
        exactContent = new TextContent(content);
      } else if (type == "image") {
        exactContent = new ImageContent(content);
      } else if (type == "video"){
        exactContent = new VideoContent(content)
      } else {
        exactContent = new TextContent("Internal server error for processing message. Please, contact system administrator.");
      }

      currentChat.add_message(currentUser.get_id(), currentUser.get_name(), exactContent, lastId+1);
      const lastMessage = currentChat.get_history().slice(-1)[0];

      if (await CommonServices.checkIfUserInChatDB(currentUser.get_id(), currentChat.get_id())){
        await ChatModel.updateOne(
        { chatId: currentChat.get_id()},
        {
         $push: { 
            chatHistory: lastMessage?.toJson(),
          }
        }
      );
      } else {
        await ChatModel.updateOne(
        { chatId: currentChat.get_id()},
        {
         $push: { 
            chatHistory: lastMessage?.toJson(),
            chatParticipants: currentUser.get_id()
          }
        }
      );
      }

      io.emit("chatMessage", lastMessage);
    } else {
      Logger.error("No user or chat selected");
    }

  });

  socket.on("disconnect", () => {
    Logger.event(`${currentUser?.get_name()} disconnected`);
  });
});