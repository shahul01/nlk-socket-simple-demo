// ### Socket  ###
export type TFrom = 'self' | 'others' | 'admin';

// COMMT: enum for autocomplete
export enum ESocketEventsDict {
  "connect" = "connect",
  "joinRoom" = "joinRoom",
  "ping" = "ping",
  "pong" = "pong",
  "clientTyping" = "clientTyping",
  "serverTyping" = "serverTyping",
  "stopTyping" = "stopTyping",
  "serverMessage" = "serverMessage",
  "clientMessage" = "clientMessage",
  "disconnect" = "disconnect",
  "reconnect" = "reconnect"
}

export interface IUser {
  id?: string;
  name: string;
  room: string;
}

export interface IServerMessageData {
  id: number;
  from: TFrom;
  username: string;
  room?: string;
  messageText: string;
}
