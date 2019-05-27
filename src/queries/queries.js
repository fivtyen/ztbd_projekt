// template
db.system.js.save(
    {
        _id: "",
        value: function(){
        return 
        }
    }
)

// nested
db.system.js.save(
    {
        _id: "findCities",
        value : function(countryName){
        return db.getCollection('locations').aggregate([
               {$match: {country: db.getCollection('countries').findOne({name:countryName})._id}},
               {$group: {_id: "$city"}}]);
        }       
    }
)

db.system.js.save(
    {
        _id: "findCityAir",
        value : function(cityName){
        return db.getCollection('air').find({
               location: db.getCollection('locations').findOne({city:cityName})._id});
        }       
    }
)

// count
db.system.js.save(
    {
        _id: "countTempAbove",
        value: function(threshold){
        return db.getCollection('weather').count({
               "data.temperature.value": {$gt:threshold}
            })
        }
    }
)

//  distinct
db.system.js.save(
    {
        _id: "findPollutants",
        value: function(){
        return db.getCollection('air').distinct("data.indexes.baqi.dominant_pollutant")
        }
    }
)

// aggregation x
db.system.js.save(
    {
        _id: "topAvgWind",
        value: function(limit){
        return db.getCollection('weather').aggregate([
                {$lookup:{
                        from:"locations",
                        localField:"location",
                        foreignField:"_id",
                        as:"out"}},
                {$addFields:{"city_name":{$arrayElemAt: ["$out.city",0]}}},
                {$unwind:"$data"},
                {$group:{
                    _id:"$city_name", 
                    avgWindSpeed:{$avg:"$data.wind.speed.value"}}},
                {$sort:{avgWindSpeed:-1}},
                {$limit:limit}
            ])  
        }
    }
)

db.system.js.save(
    {
        _id: "whereGrassPollen",
        value: function(){
        return db.getCollection('pollen').find({
            "data.types.grass.index.value": {$eq: 1}},
            {"location": 1})
        }
    }
)

db.system.js.save(
    {
        _id: "locTempAbove",
        value: function(above){
        return db.getCollection('weather').find({
            "data.temperature.value":{$gt: above}},
            {"location":1,"data.temperature.value":1}).sort({"data.temperature.value":-1})
        }
    }
)

db.system.js.save(
    {
        _id: "locFeelTempGtTemp",
        value: function(){
        return db.getCollection('weather').find({
            $where: "(this.data[0].temperature.value+this.data[1].temperature.value+this.data[2].temperature.value) < (this.data[0].feels_like_temperature.value+this.data[1].feels_like_temperature.value+this.data[2].feels_like_temperature.value)" })
        }
    }
)

db.system.js.save(
    {
        _id: "aqiPerCat",
        value: function(){
        return db.getCollection('air').aggregate([
            { $group: {
                _id: { category: "$data.indexes.baqi.category"}, 
                avg_aqi: { $avg :"$data.indexes.baqi.aqi"},
                min_aqi: {$min :"$data.indexes.baqi.aqi"}, 
                max_aqi: {$max :"$data.indexes.baqi.aqi"}}},
            {$sort: {category: -1} },
            {$project: {_id: 0, category: "$_id",avg_aqi:1, max_aqi:1, min_aqi: 1}}])
        }
    }
)

db.system.js.save(
    {
        _id: "domPolForCatName",
        value: function(catName){
        return db.getCollection('air').aggregate([
            {$match: {"data.indexes.baqi.category": catName}},
            {$group: {
                _id: { dominant_pollutant: "$data.indexes.baqi.dominant_pollutant"}, 
                number: { $sum :1}}},
            {$sort: {number: -1} }])
        }
    }
)
