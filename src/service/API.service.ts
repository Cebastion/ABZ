import type { IData } from "../interface/data.interface";
import type { IPositions } from "../interface/position.interface";
import type { IToken } from "../interface/token.interface";
import type { IUser } from "../interface/user.interface";
import axios from 'axios';

export class APIService {
    private static API_URL: string = 'https://frontend-test-assignment-api.abz.agency/api/v1'

    static async GetToken(): Promise<IToken> {
        const { data } = await axios.get<IToken>(`${this.API_URL}/token`)
        return data
    }

    static async GetPositions(): Promise<IPositions> {
        const { data } = await axios.get<IPositions>(`${this.API_URL}/positions`)
        return data
    }

    static async GetUsers(page: number = 1, count: number = 6): Promise<IData> {
        const { data } = await axios.get<IData>(`${this.API_URL}/users?page=${page}&count=${count}`)
        return data
    }


    static async PostUser(formData: FormData) {
        const { token } = await this.GetToken()
        try {
            const res = await axios.post(`${this.API_URL}/users`, formData, {
                headers: {
                    "Token": `${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            return res.data
        } catch (err) {
            if (err) {
                console.error("API error:", err.response?.data)
                return err.response?.data
            }
            throw err
        }
    }


    static SortUsers(users: IUser[]) {
        return users.sort((a, b) => b.registration_timestamp - a.registration_timestamp);
    }
}
