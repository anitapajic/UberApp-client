export interface ChangePassword{
    oldPassword : string;
    newPassword : string;
}

export interface ResetPassword{
    username : string | null | undefined;
    newPassword : string | null | undefined;
    code : string | null | undefined;
}