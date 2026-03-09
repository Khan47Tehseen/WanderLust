const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); 
require("dotenv").config({ path: "../.env" });
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({
  accessToken: mapToken
});


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("Connection Successful");
})
.catch(err=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB = async()=>{
    await Listing.deleteMany({});
    // initData.data = initData.data.map((obj)=>({...obj,owner : '69aaadfda6c26f853e873d31' ,
    //     geometry: {
    //         type: "Point",
    //         coordinates: [coordinates] // default coordinates
    //     }}));

    for(let obj of initData.data){

        // add owner
        obj.owner = '69aaadfda6c26f853e873d31';

        // get coordinates from Mapbox
        let response = await geocodingClient.forwardGeocode({
            query: `${obj.location}, ${obj.country}`,
            limit: 1
        }).send();

        // store geometry
        obj.geometry = response.body.features[0].geometry;
    }

    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();
