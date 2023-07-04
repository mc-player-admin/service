export default [
  {
    version: '0.0.0',
    sqlVersion: 1,
    init: [
      `
    create table config
    (
      id int auto_increment
        primary key,
      name varchar(100) not null,
      value text not null,
      last_edit_date datetime null
    );    
    `
    ],
    update: [
      `
    create table config
    (
    	id int auto_increment
    		primary key,
    	name varchar(100) not null,
    	value text not null,
    	last_edit_date datetime null
    );
    `
    ]
  },
  {
    version: '0.1.0',
    sqlVersion: 2,
    init: [
      `create table users
      (
          id                       int auto_increment,
          username                 varchar(50)  not null,
          password varchar(100) not null,
          qq                       int          not null,
          primary_email            varchar(50)  not null,
          status                   int          not null,
          register_date            datetime     not null,
          last_login_date          datetime     null,
          register_ip              varchar(50)  not null,
          register_user_agent      varchar(255) null,
          primary_permission_group int          null,
          constraint users_pk
              primary key (id)
      );
      
      `,
      `
      create table config
      (
        id int auto_increment
          primary key,
        name varchar(100) not null,
        value text not null,
        last_edit_date datetime null
      );`
    ],
    update: [
      `create table users
      (
        id int auto_increment
          primary key,
        username varchar(50) not null,
        password varchar(100) not null,
        qq int not null,
        primary_email varchar(50) not null,
        status int not null,
        register_date datetime not null,
        last_login_date datetime null,
        register_ip varchar(50) not null,
        register_user_agent varchar(255) null,
        primary_permission_group int null
      );
      
      `
    ]
  },
  {
    version: '0.1.0',
    sqlVersion: 3,
    init: [],
    update: [
      `alter table users
    add openid varchar(100) null;`,
      ` alter table users
    modify password varchar(100) null;`,
      `alter table users
    modify qq int null;`,

      `alter table users
    modify primary_email varchar(50) null;`
    ]
  },
  {
    sqlVersion: 4,
    init: [
      `
      create table config
      (
          id             int auto_increment
              primary key,
          name           varchar(100) not null,
          value          text         not null,
          last_edit_date datetime     null
      );
      `,
      `
      create table login_queue
      (
          id         int auto_increment
              primary key,
          uuid       varchar(100) not null,
          date       datetime     not null,
          status     int          not null,
          user       int          null,
          ip         varchar(255) null,
          user_agent varchar(255) null,
          constraint login_queue_pk
              unique (uuid),
          constraint login_queue_pk3
              unique (id)
      );
      `,
      `
      create table players
      (
          id     int auto_increment
              primary key,
          name   varchar(50) not null,
          user   int         not null,
          type   int         null,
          status int         not null,
          constraint players_pk2
              unique (id)
      );
      `,
      `
      create table users
      (
          id                       int auto_increment
              primary key,
          username                 varchar(50)  not null,
          password                 varchar(100) null,
          qq                       int          null,
          primary_email            varchar(50)  null,
          status                   int          not null,
          register_date            datetime     not null,
          last_login_date          datetime     null,
          register_ip              varchar(50)  not null,
          register_user_agent      varchar(255) null,
          primary_permission_group int          null,
          openid                   varchar(100) null
      );
      `
    ],
    update: [
      `create table players
      (
          id     int auto_increment
              primary key,
          name   varchar(50) not null,
          user   int         not null,
          type   int         null,
          status int         not null,
          constraint players_pk2
              unique (id)
      );
      
      `
    ]
  },
  {
    sqlVersion: 5,
    update: [
      `alter table players
      add transfer_id int null after name;
  `,
      `
  create table old_players_1
  (
      id            int         null,
      qq            varchar(20) null,
      name          varchar(30) null,
      status        int         null,
      date          datetime    null,
      join_type     int         null,
      score         int         null,
      xuid          varchar(20) null,
      credit_points int         null
  );
  `,
      `
  create table old_players_2
  (
      id         int          null,
      name       varchar(100) null,
      date       datetime     null,
      user_id    int          null,
      status     int          null,
      qq         varchar(20)  null,
      unban_date datetime     null
  );
  `
    ],
    init: [
      `  create table config
(
    id             int auto_increment
        primary key,
    name           varchar(100) not null,
    value          text         not null,
    last_edit_date datetime     null
);
`,
      `
create table login_queue
(
    id         int auto_increment
        primary key,
    uuid       varchar(100) not null,
    date       datetime     not null,
    status     int          not null,
    user       int          null,
    ip         varchar(255) null,
    user_agent varchar(255) null,
    constraint login_queue_pk
        unique (uuid),
    constraint login_queue_pk3
        unique (id)
);
`,
      `
create table old_players_1
(
    id            int         null,
    qq            varchar(20) null,
    name          varchar(30) null,
    status        int         null,
    date          datetime    null,
    join_type     int         null,
    score         int         null,
    xuid          varchar(20) null,
    credit_points int         null
);
`,
      `
create table old_players_2
(
    id         int          null,
    name       varchar(100) null,
    date       datetime     null,
    user_id    int          null,
    status     int          null,
    qq         varchar(20)  null,
    unban_date datetime     null
);
`,
      `
create table players
(
    id          int auto_increment
        primary key,
    name        varchar(50) not null,
    transfer_id int         null,
    user        int         not null,
    type        int         null,
    status      int         not null,
    constraint players_pk2
        unique (id)
);
`,
      `
create table users
(
    id                       int auto_increment
        primary key,
    username                 varchar(50)  not null,
    password                 varchar(100) null,
    qq                       int          null,
    primary_email            varchar(50)  null,
    status                   int          not null,
    register_date            datetime     not null,
    last_login_date          datetime     null,
    register_ip              varchar(50)  not null,
    register_user_agent      varchar(255) null,
    primary_permission_group int          null,
    openid                   varchar(100) null
);
`
    ]
  },
  {
    sqlVersion: 6,
    update: [
      `create table audits
      (
          id            varchar(20)          not null
              primary key,
          user          int          not null,
          name          varchar(50)  not null,
          bili_username varchar(50)  not null,
          bili_uid      varchar(50)  not null,
          screenshot    varchar(255) not null,
          status        int          not null,
          result        int          null,
          cause         text         null,
          approver      int          null,
          date          datetime     not null,
          constraint audits_pk
              unique (id)
      );
      
      `
    ],
    init: [
      `create table audits
(
    id            varchar(20)          not null
        primary key,
    user          int          not null,
    name          varchar(50)  not null,
    bili_username varchar(50)  not null,
    bili_uid      varchar(50)  not null,
    screenshot    varchar(255) not null,
    status        int          not null,
    result        int          null,
    cause         text         null,
    approver      int          null,
    date          datetime     not null,
    constraint audits_pk
        unique (id)
);`,
      `

create table config
(
    id             int auto_increment
        primary key,
    name           varchar(100) not null,
    value          text         not null,
    last_edit_date datetime     null
);`,
      `

create table login_queue
(
    id         int auto_increment
        primary key,
    uuid       varchar(100) not null,
    date       datetime     not null,
    status     int          not null,
    user       int          null,
    ip         varchar(255) null,
    user_agent varchar(255) null,
    constraint login_queue_pk
        unique (uuid),
    constraint login_queue_pk3
        unique (id)
);`,
      `

create table old_players_1
(
    id            int         null,
    qq            varchar(20) null,
    name          varchar(30) null,
    status        int         null,
    date          datetime    null,
    join_type     int         null,
    score         int         null,
    xuid          varchar(20) null,
    credit_points int         null
);`,
      `

create table old_players_2
(
    id         int          null,
    name       varchar(100) null,
    date       datetime     null,
    user_id    int          null,
    status     int          null,
    qq         varchar(20)  null,
    unban_date datetime     null
);`,
      `

create table players
(
    id          int auto_increment
        primary key,
    name        varchar(50) not null,
    transfer_id int         null,
    user        int         not null,
    type        int         null,
    status      int         not null,
    constraint players_pk2
        unique (id)
);`,
      `

create table users
(
    id                       int auto_increment
        primary key,
    username                 varchar(50)  not null,
    password                 varchar(100) null,
    qq                       int          null,
    primary_email            varchar(50)  null,
    status                   int          not null,
    register_date            datetime     not null,
    last_login_date          datetime     null,
    register_ip              varchar(50)  not null,
    register_user_agent      varchar(255) null,
    primary_permission_group int          null,
    openid                   varchar(100) null
);`
    ]
  },

  {
    sqlVersion: 7,
    init: [
      `create table audits
(
    id            varchar(20)  not null
        primary key,
    user          int          not null,
    name          varchar(50)  not null,
    bili_username varchar(50)  not null,
    bili_uid      varchar(50)  not null,
    screenshot    varchar(255) not null,
    status        int          not null,
    result        int          null,
    cause         text         null,
    approver      int          null,
    date          datetime     not null,
    constraint audits_pk
        unique (id)
);
`,
      `
create table config
(
    id             int auto_increment
        primary key,
    name           varchar(100) not null,
    value          text         not null,
    last_edit_date datetime     null
);
`,
      `
create table login_queue
(
    id         int auto_increment
        primary key,
    uuid       varchar(100) not null,
    date       datetime     not null,
    status     int          not null,
    user       int          null,
    ip         varchar(255) null,
    user_agent varchar(255) null,
    constraint login_queue_pk
        unique (uuid),
    constraint login_queue_pk3
        unique (id)
);
`,
      `
create table old_players_1
(
    id            int         null,
    qq            varchar(20) null,
    name          varchar(30) null,
    status        int         null,
    date          datetime    null,
    join_type     int         null,
    score         int         null,
    xuid          varchar(20) null,
    credit_points int         null
);
`,
      `
create table old_players_2
(
    id         int          null,
    name       varchar(100) null,
    date       datetime     null,
    user_id    int          null,
    status     int          null,
    qq         varchar(20)  null,
    unban_date datetime     null
);
`,
      `
create table permission_group
(
    id      int auto_increment
        primary key,
    \`group\` int          not null,
    name    varchar(100) not null,
    value   tinyint(1)   null,
    constraint premission_group_pk2
        unique (id)
);
`,
      `
create table permission_groups
(
    id   int auto_increment
        primary key,
    name varchar(100) not null,
    constraint premission_groups_pk2
        unique (id)
);
`,
      `
create table players
(
    id          int auto_increment
        primary key,
    name        varchar(50) not null,
    transfer_id int         null,
    user        int         not null,
    type        int         null,
    status      int         not null,
    constraint players_pk2
        unique (id)
);
`,
      `
create table users
(
    id                       int auto_increment
        primary key,
    username                 varchar(50)  not null,
    password                 varchar(100) null,
    qq                       varchar(50)  null,
    primary_email            varchar(50)  null,
    status                   int          not null,
    register_date            datetime     not null,
    last_login_date          datetime     null,
    register_ip              varchar(50)  not null,
    register_user_agent      varchar(255) null,
    primary_permission_group int          null,
    openid                   varchar(100) null,
    avatar                   varchar(255) null
);
`
    ]
  }
] as {
  version: string
  sqlVersion: number
  init: string[]
  update: string[]
}[]
