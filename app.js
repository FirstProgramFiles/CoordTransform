const express = require("express");
const proj4 = require("proj4");
const multer = require("multer");
const app = express();


const storageConfig = multer.diskStorage({
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

app.use(express.static(__dirname));
app.use(multer({ storage: storageConfig }).single("filedata"));

app.post("/Transform", function (req, res, next) {
	data = req.body.Coords;
	Coord = JSON.parse(data);
	console.log(Coord);
	const longitude = Coord.longitude
	const latitude = Coord.latitude;
	const LonTransform = [];
	const LatTransform = [];

	//МСК-65
	const fromProjection = '+proj=tmerc +lat_0=0 +lon_0=142.71666666667 +k=1 +x_0=1300000 +y_0=-4516586.439 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs';
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
app.listen(3000);
module.exports = app;