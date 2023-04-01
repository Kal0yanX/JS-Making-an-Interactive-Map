const getCurrentPosition = async () => {
	const pos = await new Promise((resolve, reject) => {
	  navigator.geolocation.getCurrentPosition(resolve, reject);
	});
	return [pos.coords.latitude, pos.coords.longitude];
  };
  
  const errorCallback = (error) => {
	console.log(error);
  };
  
  const successCallback = async (coordinates) => {
	const myMap = {
	  coordinates: coordinates,
	  businesses: [],
	  map: {},
	  markers: {},
	  // build leaflet map
	  buildMap() {
		this.map = L.map("map", {
		  center: this.coordinates,
		  zoom: 9,
		});
		// add openstreetmap tiles
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		  attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: '12',
		}).addTo(this.map);
		// create and add geolocation marker
		const marker = L.marker(this.coordinates);
		marker
		  .addTo(this.map)
		  .bindPopup("<p1><b>You are here</b><br></p1>")
		  .openPopup();
	  },
	  // add business markers
	  addMarkers() {
		for (let i = 0; i < this.businesses.length; i++) {
		  this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		  ])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map);
		}
	  },
	};
  
	try {
	  const options = {
		method: "GET",
		headers: {
		  Accept: "application/json",
		  Authorization: "fsq3zOqedR02KYNJfYnIix+gZLlgY4PIdfT27oGdouHn5YY=",
		},
	  };
	  const response = await fetch(
		`https://api.foursquare.com/v3/places/search?&query=${business}&limit=5&ll=${coordinates[0]}%2C${coordinates[1]}`,
		options
	  );
	  const data = await response.json();
	  myMap.businesses = data.results.map((element) => {
		return {
		  name: element.name,
		  lat: element.geocodes.main.latitude,
		  long: element.geocodes.main.longitude,
		};
	  });
	  myMap.buildMap();
	  myMap.addMarkers();
	} catch (error) {
	  console.log(error);
	}
  };
  
  // process foursquare array
  function processBusinesses(data) {
	  let businesses = data.map((element) => {
		  let location = {
			  name: element.name,
			  lat: element.geocodes.main.latitude,
			  long: element.geocodes.main.longitude
		  };
		  return location
	  })
	  return businesses
  }
  
  // get foursquare businesses
  async function getFoursquare(business) {
	  const options = {
		  method: 'GET',
		  headers: {
		  Accept: 'application/json',
		  Authorization: 'fsq3zOqedR02KYNJfYnIix+gZLlgY4PIdfT27oGdouHn5YY='
		  }
	  }
	  let limit = 5
	  let lat = myMap.coordinates[0]
	  let lon = myMap.coordinates[1]
	  let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	  let data = await response.text()
	  let parsedData = JSON.parse(data)
	  let businesses = parsedData.results
	  return businesses
  }
  
  
  getCurrentPosition()
	.then(successCallback)
	.catch(errorCallback);
  
  // business submit button
  document.getElementById('submit').addEventListener('click', async (event) => {
	  event.preventDefault()
	  let business = document.getElementById('business').value
	  let data = await getFoursquare(business)
	  myMap.businesses = processBusinesses(data)
	  myMap.addMarkers()
  });
  

//SOLUTION
// // map object
// const myMap = {
// 	coordinates: [],
// 	businesses: [],
// 	map: {},
// 	markers: {},

// // build leaflet map
// 	buildMap() {
// 		this.map = L.map('map', {
// 		center: this.coordinates,
// 		zoom: 9,
// 		});
// 		// add openstreetmap tiles
// 		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 		attribution:
// 			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 		minZoom: '15',
// 		}).addTo(this.map)
// 		// create and add geolocation marker
// 		const marker = L.marker(this.coordinates)
// 		marker
// 		.addTo(this.map)
// 		.bindPopup('<p1><b>You`re here</b><br></p1>')
// 		.openPopup()
// 	},

// // add business markers
// 	addMarkers() {
// 		for (var i = 0; i < this.businesses.length; i++) {
// 		this.markers = L.marker([
// 			this.businesses[i].lat,
// 			this.businesses[i].long,
// 		])
// 			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
// 			.addTo(this.map)
// 		}
// 	},
// }

// // get coordinates via geolocation api
// async function getCoords(){
// 	const pos = await new Promise((resolve, reject) => {
// 		navigator.geolocation.getCurrentPosition(resolve, reject)
// 	});
// 	return [pos.coords.latitude, pos.coords.longitude]
// }

// // get foursquare businesses
// async function getFoursquare(business) {
// 	const options = {
// 		method: 'GET',
// 		headers: {
// 		Accept: 'application/json',
// 		Authorization: 'fsq3zOqedR02KYNJfYnIix+gZLlgY4PIdfT27oGdouHn5YY='
// 		}
// 	}
// 	let limit = 5
// 	let lat = myMap.coordinates[0]
// 	let lon = myMap.coordinates[1]
// 	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
// 	let data = await response.text()
// 	let parsedData = JSON.parse(data)
// 	let businesses = parsedData.results
// 	return businesses
// }
// // process foursquare array
// function processBusinesses(data) {
// 	let businesses = data.map((element) => {
// 		let location = {
// 			name: element.name,
// 			lat: element.geocodes.main.latitude,
// 			long: element.geocodes.main.longitude
// 		};
// 		return location
// 	})
// 	return businesses
// }

// // window load
// window.onload = async () => {
// 	const coords = await getCoords()
// 	myMap.coordinates = coords
// 	myMap.buildMap()
// }

// // business submit button
// document.getElementById('submit').addEventListener('click', async (event) => {
// 	event.preventDefault()
// 	let business = document.getElementById('business').value
// 	let data = await getFoursquare(business)
// 	myMap.businesses = processBusinesses(data)
// 	myMap.addMarkers()
// })

// function deleteMarkers(){
// 	window.location.reload();
// }