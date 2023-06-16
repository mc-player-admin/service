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
          primary_premission_group int          null,
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
        primary_premission_group int null
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
  }
] as {
  version: string
  sqlVersion: number
  init: string[]
  update: string[]
}[]
