// ### Socket  ###
export type TFrom = 'self' | 'others' | 'admin';

// COMMT: enum for autocomplete
export enum ESocketEventsDict {
  "connect" = "connect",
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
  from: TFrom;
  username: string;
  room: string;
  messageText: string;
}
