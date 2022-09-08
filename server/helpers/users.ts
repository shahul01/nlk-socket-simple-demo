import { IUser } from "assets/types/global";

const users: IUser[] = [];


const addUser = ({ id, name, room }: IUser) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((currUser) => {
    return currUser?.room === room && currUser.name === name
  });

  if (!name || !room) return { error: 'Username and room are required.'};
  if (existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room};
  users.push(user);

  return { user }
};

module.exports = { addUser };
