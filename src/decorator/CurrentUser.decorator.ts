import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.currentUser
    return data ? user?.[data] : user
  }
)