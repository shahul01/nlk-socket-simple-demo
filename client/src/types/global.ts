
// ### React ###
export type TStateCount = ( (arg0:number)=>number ) | number;

export interface IKeyAxes {
  'x': number;
  'y': number;
  'height': number;
  'width': number;
  'top': number;
  'right': number;
  'bottom': number;
  'left': number;
  'forceUpdate': number;
}

export interface ICursorPos {
  top: number;
  left: number;
}

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
  "isTyping" = "isTyping",
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
