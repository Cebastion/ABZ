export interface IUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    position: string;
    position_id: number
    registration_timestamp: number;
    photo: string;
}

export const initailUser: IUser = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    position: '',
    position_id: 0,
    registration_timestamp: 0,
    photo: ''
}

export interface IUsers {
    users: IUser[];
}


export const initailUsers: IUsers = {
    users: [initailUser]
}
