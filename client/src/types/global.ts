
// ### React ###
export type TStateCount = ( (arg0:number)=>number ) | number;

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

export interface IClientMessageData {
  id: number;
  from: TFrom;
  username: string;
  // room: string;
  messageText: string;
}

export interface IUser {
  id?: string;
  name: string;
  room: string;
}
