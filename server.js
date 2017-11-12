const sql = require('mssql')

// Configure Express server.
const express = require('express'),
	app = express(),
	port = 3000

// Set routes for static files.
app.use('/', express.static('pages'))

// Configure SQL Server connection.
const dbConfig = {
	user: '***',
	password: '***',
	server: '***',
	database: '***',
	port: 1433,
	encrypt: true,
}

let pool;

// Create database pool, then start application.
const startApp = async () => {
	pool = await sql.connect(dbConfig)
	app.listen(3000)
}

// Object containing all queries as prepared statements.
const queries = {
	getCategories: 'select * from dbo.widget_categories',
}

const doQuery = async (qry) => await pool.request().query(qry)

app.get ('/', function (req, res) {
	res.send('Hello.')
})

startApp()
