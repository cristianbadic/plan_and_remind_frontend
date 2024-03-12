import { UserResponse } from "./user-response.model";

export interface UserSearch {
    userEntity: UserResponse;
    status: string;
    requestId: number;
}