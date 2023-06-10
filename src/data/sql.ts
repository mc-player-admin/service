export default [
  {
    version: '0.0.0',
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
  }
]
