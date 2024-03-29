
const mongoose=require('mongoose');
const cities=require('./cities');
const{places,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
        useNewUrlParser:true,
        
        useUnifiedTopology:true

});
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
const sample=(array)=>array[Math.floor(Math.random()*array.length)]
const seedDB=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
       const camp= new Campground({
           author:'652e40333c3f3645350a3b08',
            location:`${cities[random1000].city},${cities[random1000].state}`,
           title:`${sample(descriptors)} ${sample(places)}`,
          
           price,
           images: [
            {
              url: 'https://res.cloudinary.com/dyu71owv5/image/upload/v1697737118/YelpCamp/sbxdbtrfmw4hjwsypuoz.jpg',
              filename: 'YelpCamp/sbxdbtrfmw4hjwsypuoz',
             
            },
            {
              url: 'https://res.cloudinary.com/dyu71owv5/image/upload/v1697737118/YelpCamp/sieqpxvwtemjyqaqihjz.jpg',
              filename: 'YelpCamp/sieqpxvwtemjyqaqihjz',
              
            }
          ]
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})