import { IUser } from "assets/types/global";

const userTemplate:IUser = { id: '', name: '', room: '' };
const users: IUser[] = [];

export const addUser = ({ id, name, room }: IUser) => {
  name = name?.trim().toLowerCase();
  room = room?.trim().toLowerCase();

  const existingUser = users.find((currUser) => {
    return currUser?.room === room && currUser.name === name
  });

  if (!name || !room) return { error: 'Username and room are required.'};
  if (existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room};
  users.push(user);

  return { user };
};

export const removeUser = (socketId:string) => {
  const idx = users.findIndex(currUser => currUser.id === socketId);
  if (idx !== -1) return users.splice(idx, 1)?.[0];
};

export const getUser = (id:string):IUser => users.find(currUser => currUser?.id === id) || userTemplate;

export const getUsersInRoom = (room:string):IUser[] => users.filter(currUser => currUser.room === room) || [userTemplate];

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
