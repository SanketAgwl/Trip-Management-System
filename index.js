import express from 'express';
import path from 'path';
const app = express();
var router = express.Router();

import bodyParser from 'body-parser'

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

import mysql from 'mysql';

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'project111',
  multipleStatements: true
  });
  
  
  // open the MySQL connection
  connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
  });
  
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

app.use( express.static( "public" ) );


app.get('/',function(req,res, next) {
    connection.query('Select * from Cabs', (err, result)=> {
      console.log(result)
      if(err) throw err;
      res.render('home');
    })
  });

app.get('/explore',function(req,res) {
  connection.query('Select * from City', (err, result)=> {
    res.render('explore', {data1: result});
  })
})


app.post('/explore',function(req,res) {
  connection.query('select distinct city.city_name,nearby_city,hotel_name,restaurant_name from city,nearbycities,hotel,locality,restaurants where current_city=city.city_name && hotel.locality_id=locality.locality_id && restaurants.locality_id=locality.locality_id && current_city=? && locality.city_name=current_city;', [req.body.city], (err, result)=> {
    res.render('explore', {data1: result});
    console.log(result);
  })
})

app.post('/bus', function(req, res) {
  console.log(req.body);
  connection.query('Select * from BusReservation where source =? and destination= ?', [req.body.city1, req.body.city2], (err, result, fields)=> {
    // console.log(data1);
    res.render('bus', {data1: result});
    console.log(result);
  })
})

app.post('/addbus', (req, res) => {
  connection.query('Insert into BusReservation(bus_id, source, destination, departure_date, seat_type) VALUES("'+req.body.busid+'","'+req.body.city1+'", "'+req.body.city2+'", "'+req.body.dd+'", "'+req.body.st+'")', (err, result, fields)=> {
    console.log(req.body.city1, req.body.city2, req.body.dd, req.body.st, req.body.noseat);

    // console.log(data1);
    res.redirect('/book')
  })
  // connection.query('Insert into City(city_name) VALUES("'+req.body.city1+'");)', (err, result, fields)=> {
  //   console.log(req.body.city1, req.body.city2, req.body.dd, req.body.st, req.body.noseat);

  //   // console.log(data1);
  //   res.redirect('/book')
  // })
})


app.post('/deletebus', (req, res) => {
  connection.query('delete from BusReservation where bus_id = ? and source = ? and destination = ? and departure_date= ? and seat_type = ?', [req.body.id, req.body.city1, req.body.city2, req.body.dd, req.body.st], (err, result, fields)=> {
    console.log(req.body);
    res.redirect('/book');
    // console.log(result);
  })
})

app.get('/book',function(req,res) {
  connection.query('select distinct service_provider, is_ac,bus_id from city natural join bus natural join BusDepartureTime;', (err, result)=> {
    res.render('book', {data1: result});
    console.log(result);
  })
})

app.get('/hotel',function(req,res) {
  connection.query('Select * from Hotel, locality where hotel.locality_id = locality.locality_id', (err, result)=> {
    res.render('hotel', {data1: result});
  })
})

app.post('/hotel',function(req,res) {
  connection.query('Insert into hotel()', (err, result)=> {
    res.render('hotel', {data1: result});
  })
})

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('App listening on port 3000!');
   });
