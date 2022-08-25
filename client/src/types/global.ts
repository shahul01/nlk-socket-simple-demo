// ### Socket  ###
export enum ESocketEventsDict {
  "connection" = "connection",
  "joinRoom" = "joinRoom",
  "ping" = "ping",
  "pong" = "pong",
  "typing" = "typing",
  "stopTyping" = "stopTyping",
  "serverMessage" = "serverMessage",
  "clientMessage" = "clientMessage",
  "disconnect" = "disconnect",
  "reconnect" = "reconnect"
}

export interface IClientMessageData {
  id: number;
  message: string;
}
