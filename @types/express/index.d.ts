import User from "../../src/model/User"

declare global {
  namespace Express {
    interface Request {
      currentUser: User
    }
  }
}
