import { Field, InputType, registerEnumType } from "type-graphql"
import { BanReason } from "@app/classes/graphql/user/ban"

export enum AdminPunishmentType {
  DELETE_UPLOAD,
  DELETE_ACCOUNT_IMMEDIATELY
}

registerEnumType(AdminPunishmentType, {
  name: "AdminPunishmentType"
})

@InputType()
export class AdminPunishmentUploadInput {
  @Field()
  uploadId: number
  @Field(() => AdminPunishmentType)
  type: AdminPunishmentType
  @Field(() => BanReason, {
    nullable: true
  })
  banReason?: BanReason
  @Field(() => String, {
    nullable: true,
    description:
      "You may use either 2FA token or password. Required for DELETE_ACCOUNT_IMMEDIATELY."
  })
  password?: string
  @Field({
    nullable: true,
    description:
      "TOTP/2FA code if enabled. You may use either 2FA token or password. Required for DELETE_ACCOUNT_IMMEDIATELY."
  })
  totp?: string
}
