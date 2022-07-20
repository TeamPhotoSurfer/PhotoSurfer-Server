export interface LoginUserDTO{
    accessToken: string;
    socialType: string;
    fcmToken: string;
    push: boolean;
}