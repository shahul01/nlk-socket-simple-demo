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

export interface IServerMessageData {
  id: number;
  fromSelf: boolean;
  username: string;
  messageText: string;
}
