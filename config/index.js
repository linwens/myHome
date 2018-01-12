'use strict'
const obj = {
	//本地开发用8488端口
	PORT:process.env.NODE_ENV==='development'?8488:8888,
	//本地开发数据库mongodbTest
	mongoUrl:'mongodb://localhost:27018/'+(process.env.NODE_ENV==='development'?'mongodbTest':'linwensmongo')
}
module.exports = obj