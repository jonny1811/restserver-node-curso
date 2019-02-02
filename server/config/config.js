//////////////////
// Puerto
//////////////////
process.env.PORT = process.env.PORT || 3000;

//////////////////
// Entorno
//////////////////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//////////////////
// DB
//////////////////
let urlDB

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';

}else {
    urlDB = 'mongodb://adm-user:Jonny123456@ds119765.mlab.com:19765/cafe';
}
process.env.URLDB = urlDB;