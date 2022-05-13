interface SignParam {
  userName: string;
  passwordHash: string;
}

interface SessionData {
  userName: string;
  lastVisitTime: number;
  lastLoginTime: number;
  ip: string;
  userAgent: string;
}
interface UserModel extends CommonModel{
  user_name: string
  password_hash: string
}