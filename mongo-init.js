// 认证为管理员
db.auth('root', 'bazipassword');

// 使用bazi_app数据库
db = db.getSiblingDB('bazi_app');

// 创建应用使用的用户
db.createUser({
  user: 'bazi_user',
  pwd: 'bazi_password',
  roles: [
    {
      role: 'readWrite',
      db: 'bazi_app'
    }
  ]
});

// 创建集合
db.createCollection('users');
db.createCollection('visits');
db.createCollection('calculations'); 