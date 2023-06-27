export interface Permission {
  visitor: {
    register: boolean | null
    login: boolean | null
    query_player: boolean | null
  }
  user: {
    submit: boolean | null
    transfer: boolean | null
    upload: boolean | null
    query_status: boolean | null
  }
  admin: {
    audit: boolean | null
    edit_userinfo: boolean | null
    edit_player: boolean | null
    create_user: boolean | null
    create_player: boolean | null
    edit_permission: boolean | null
  }
}
