const sql = require('mssql')
const http = require('http')
const bodyParser = require('body-parser')

// Configure Express server.
const express = require('express'),
	app = express(),
	port = 80

// Set routes for static files.
app.use('/', express.static('static'))

// Create an application/json parser
var jsonParser = bodyParser.json()

// Configure SQL Server connection.
const dbConfig = {
	user: 'eric',
	password: 'TK421!!!',
	server: 'eric.c59z71omoilm.us-east-1.rds.amazonaws.com',
	database: 'emtc',
	port: 1433,
	encrypt: true,
}

// Create database pool, connect to database, and then start application.
let pool;
const startApp = async () => {
	try {
		pool = await sql.connect(dbConfig)
		app.listen(80)
	} catch(err) {

		// NOTE: Actual error reporting would need to be a lot stronger.
		// I've left try/catch out of query attempts to not repeat the
		// not-so-useful console output.
		console.log(err);
	}
}

// Requests a query and returns the first recordset in the returned object.
const doQuery = async (qry) => {
	const results = await pool.request().query(qry);
	return results.recordset;
}

// Return full widget inventory.
app.get('/api/v1/widgets', function(req, res) {
	(async () => {
		res.setHeader('Content-Type', 'application/json')
		try {
			const results = await doQuery(`SELECT i.InventoryId, c.CategoryName, s.SizeName, f.FinishName, f.FinishHex , i.Quantity
																		 FROM dbo.widget_inventory i
																		 INNER JOIN dbo.widget_sizes s ON s.SizeId = i.SizeId
																		 INNER JOIN dbo.widget_categories c ON c.CategoryId = i.CategoryId
																		 INNER JOIN dbo.widget_finishes f ON  f.FinishId = i.FinishId
																		 ORDER BY i.InventoryId ASC`)
			res.send(results)
		} catch(err) {
			res.sendStatus(400)
		}
	})()
})

// Return widget categories.
app.get('/api/v1/categories', function(req, res) {
	(async () => {
		res.setHeader('Content-Type', 'application/json')
		try {
			const results = await doQuery(`SELECT CategoryId, CategoryName
																		 FROM dbo.widget_categories
																		 ORDER BY CategoryId ASC`)
			res.send(results)
		} catch(err) {
			res.sendStatus(400)
		}
	})()
})



// Update the quantity of a category item.
app.put('/api/v1/widgets/item', jsonParser, function(req, res) {
	(async () => {
		res.setHeader('Content-Type', 'application/json')
		const paramQuantity = req.body.quantity
		const paramId = req.body.id
		try {
			console.log(req.body);

			const ps = new sql.PreparedStatement(pool)
			ps.input('quantity', sql.Int)
			ps.input('id', sql.Int)
			ps.prepare(`UPDATE dbo.widget_inventory
									SET Quantity = @quantity
									WHERE InventoryId = @id`, err => {

			// TODO: Error checks
			ps.execute({quantity: paramQuantity, id: paramId}, (err, result) => {
				// TODO: error handling
					ps.unprepare(err => {
						// TODO: error handling
					})
					res.send(result);
				})
			})

		} catch(err) {
			res.sendStatus(400)
		}
	})();
})

startApp()
