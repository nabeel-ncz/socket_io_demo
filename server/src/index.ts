import express, { Application } from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";

const app: Application = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    }
});

io.on('connection', (socket: Socket) => {
    console.log(`User connected at ${socket.id}`);

    socket.on('join_room', (data: { room: string }) => {
        socket.join(data.room);
    })

    socket.on('send_message', (data: { room: string, message: string }) => {
        socket.to(data.room).emit('recieve_message', data);
    });
    
});

const PORT: number | string = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`server listening at ${PORT}`);
});