const express = require("express");
const proj4 = require("proj4");
const multer = require("multer");
const app = express();
const PORT = process.env.PORT || 3000;

const storageConfig = multer.diskStorage({
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

app.use(multer({ storage: storageConfig }).single("filedata"));

app.post("/Transform", function (req, res) {
	data = req.body.Coords;
	CoordinateSystem = (req.body.CoordinateSystem).replace(/\r\n/g, '');
	Coord = JSON.parse(data);
	console.log(Coord);
	console.log(CoordinateSystem);
	const longitude = Coord.longitude
	const latitude = Coord.latitude;
	const LonTransform = [];
	const LatTransform = [];

	switch (CoordinateSystem) {
		case 'МСК-65':
			var fromProjection = '+proj=tmerc +lat_0=0 +lon_0=142.71666666667 +k=1 +x_0=1300000 +y_0=-4516586.439 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs';
			break;
		case 'ГСК-2011':
			var fromProjection = '+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +a=6378136.5 +rf=298.2564151 +towgs84=0.013,-0.092,-0.03,-0.001738,0.003559,-0.004263,0.0074 +units=m +no_defs';
			break;
		case 'СК-42':
			var fromProjection = '+proj=longlat +datum=WGS84 +to +proj=tmerc +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +lon_0=39 +x_0=7500000';
			break;
	}

	const toProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'; //WGS84

	for (let i = 0; i < longitude.length; i++) {
		let TransformCoord = proj4(fromProjection, toProjection, [Number(longitude[i]), Number(latitude[i])]);
		LonTransform.push(TransformCoord[0]);
		LatTransform.push(TransformCoord[1]);
	}
	let TransformCoord = {
		longitude: LonTransform,
		latitude: LatTransform
	}
	global.json = JSON.stringify(TransformCoord);
	res.send(json);
	console.log(LonTransform);
	console.log(LatTransform);
});
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
module.exports = app;