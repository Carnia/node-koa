let mysql      = require('mysql');
// let connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '123',
//   database : 'table1'
// });
// connection.connect();
// connection.end(function(err){
// Do something after the connection is gracefully terminated.
// });
// connection.destroy( );
// connection.query('SELECT * FROM demo', function (error, results, fields) {
//   if (error) throw error;
//   console.log(fields)
//   console.log(results)
// });
let pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '123',
    database : 'table1'
});

// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

let query = function( sql, values ) {
  // 返回一个 Promise
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

module.exports =  query
// connection.query("INSERT INTO demo(name,gender,score) VALUES ('xm','F',99) ", function (error, results, fields) {
//   if (error) throw error;
//   console.log(fields)
//   console.log(results)
// });