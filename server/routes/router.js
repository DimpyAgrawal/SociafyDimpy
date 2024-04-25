const express = require('express');
const app = express();
const router = express.Router();
const bcrypt  =  require('bcrypt');
const User  = require('../model/User');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/middleware')

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your route handling code here



router.post("/register", async (req, res) => {
    console.log("register"); 
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.send({ error: "Fill Complete details" })
    }
    console.log(name + " " + email + " " + password);

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        console.log(name + " " + email + " " + password);

        const oldUser = await User.findOne({ email });

        
        if (oldUser) {
            return res.json({ error: "User Exists" });
        }
        const response = await User.create({
            name,
            email,
            password: encryptedPassword
        });
        return res.json({ success: "User Registered Successfully" });
        // res.send({ status: "Data Save Succesfully" });
    } catch (error) {
        res.status(400).send({ message: error });
    }
});
  

router.post("/login", async (req, res) => {
    console.log("login");
    const { email, password } = req.body;

    console.log(email + " " + password);

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ error: "User Not found" });
    }
    console.log(user);
    if (await bcrypt.compare(password, user.password)) {
        console.log(user);
        const token = jwt.sign({email: user.email,name: user.name, id:user._id}, process.env.JWT_SECRET)
        if (res.status(201)) {
            return res.json({ status: "ok", message: "Login Successfully", data: token, user:user });
        } else {
            return res.json({ error: "error" });
        }
    }
    res.json({ status: "error", error: "Invalid Authentication" });
})


router.get('/getProfileData/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);

        if (!user) return res.status(401).json({ message: 'User not found' });

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(401).json({ message: 'Error', error });
    }
})

router.put('/setImageToDB',authenticate,async(req,res)=>{
   console.log('profile image API' + req.body.pic+" ");
    try{
        const updatedUser = await User.findByIdAndUpdate(req.user._id,{
            $set:{photo: req.body.pic}
        },{new:true});
        if(!updatedUser) return res.status(401).json({message:'User not found'})
          return res.status(200).json({message:'profile image updated successfully',user : updatedUser})
    }catch(error){
        return res.status(400).json({message:'error in saving the image'});
    }
});

router.put('/saveFollowers', authenticate, async (req, res) => {
    const { userId } = req.body;
    console.log('saveFollwers' + userId);

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $push: { following: userId }
        }, { new: true });
        await User.findByIdAndUpdate(userId, {
            $push: { followers: req.user._id }
        }, { new: true });

        return res.status(200).json({ message: 'followers is added' });

    } catch (error) {
        console.error('Error saving followers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



router.put('/saveunFollowers', authenticate, async (req, res) => {
    const { userId } = req.body;
    console.log('saveFollwers' + userId);

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: userId }
        }, { new: true });
        await User.findByIdAndUpdate(userId, {
            $pull: { followers: req.user._id }
        }, { new: true });

        return res.status(200).json({ message: 'followers is added' });

    } catch (error) {
        console.error('Error saving followers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router;