import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController
} from "socket-controllers"
import { Service } from "typedi"
import { SocketAuth } from "@app/types/socket"
import { SocketAuthMiddleware } from "@app/lib/socket-auth"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import { User } from "@app/models/user.model"
import { UserUtilsService } from "@app/services/userUtils.service"

@SocketController("/user")
@Service()
export class UserSocketController {
  constructor(
    private socketAuthMiddleware: SocketAuthMiddleware,
    private userService: UserUtilsService
  ) {}

  @OnConnect()
  async onConnect(@ConnectedSocket() socket: SocketAuth) {
    const session = await this.socketAuthMiddleware.use(
      socket,
      () => {},
      SocketNamespaces.USER
    )
    if (session) {
      socket.join(session.user.id)
      // if (user.storedStatus === "invisible") return
      // if (user.status.toString() !== user.storedStatus.toString()) {
      //   await User.update(
      //     {
      //       status: user.storedStatus
      //     },
      //     {
      //       where: {
      //         id: user.id
      //       }
      //     }
      //   )
      // }
      // await this.userService.emitToTrackedUsers(user.id, "userStatus", {
      //   id: user.id,
      //   status: user.storedStatus.toUpperCase(),
      //   TODO: Platform presence
      // platforms: []
      // })
    }
    socket.emit("removed", {
      message:
        "Presence & Status on the legacy /gateway endpoint is no longer supported. Please move to the new GraphQL Subscriptions API."
    })
  }

  @OnDisconnect()
  async onDisconnect(@ConnectedSocket() socket: SocketAuth) {
    // const session = await this.socketAuthMiddleware.use(
    //   socket,
    //   () => {},
    //   SocketNamespaces.USER
    // )
    //
    // if (session) {
    //   const user = session.user
    //   const sockets = await global.socket.in(user.id).allSockets()
    //   if (sockets.size === 0) {
    //     if (user.storedStatus === "invisible") return
    //     await User.update(
    //       {
    //         status: "offline"
    //       },
    //       {
    //         where: {
    //           id: user.id
    //         }
    //       }
    //     )
    //     await this.userService.emitToTrackedUsers(user.id, "userStatus", {
    //       id: user.id,
    //       status: "OFFLINE",
    //       // TODO: Platform presence
    //       platforms: []
    //     })
    //   }
    // }
  }

  @OnMessage("idleTime")
  async idleTime(
    @ConnectedSocket() skt: SocketAuth,
    @MessageBody() data: number
  ) {
    skt.emit("removed", {
      message:
        "Presence & Status on the legacy /gateway endpoint is no longer supported. Please move to the new GraphQL Subscriptions API."
    })
    const session = await this.socketAuthMiddleware.use(
      skt,
      () => {},
      SocketNamespaces.USER
    )
    if (session) {
      const user = session.user
      socket.of(SocketNamespaces.USER).to(user.id).emit("idleTime", data)
    }
  }
}
