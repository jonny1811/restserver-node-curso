//////////////////
// Puerto
//////////////////
process.env.PORT = process.env.PORT || 3000;

//////////////////
// Entorno
//////////////////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//////////////////
// Caducidad del Token
//////////////////
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//////////////////
// Seed del Token
//////////////////
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

//////////////////
// DB
//////////////////
let urlDB

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';

}else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//////////////////
// Client ID
//////////////////
process.env.CLIENT_ID = process.env.CLIENT_ID || '219322917348-medbqu7ct5j3mepj95mm57rkuisqf6ja.apps.googleusercontent.com';