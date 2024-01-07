const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const campgrounds=require('../controllers/campgrounds')
const Campground=require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground}=require('../models/middleware')
const {storage}=require('../cloudinary');
const multer=require('multer');
const upload=multer({storage})

router.route('/').get (catchAsync(campgrounds.index))
.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))


router.get('/new',isLoggedIn,campgrounds.renderNewForm);


router.post('/',isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground))

router.get('/:id',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error','Cannot find that campground!');
       return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground});
}))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground));

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));







module.exports=router;