import User from "../models/User.js";
import Message from "../models/message.js"
import cloudinary from "../lib/cloudinary.js"
import {io,userSocketMap} from "../server.js"

// get all users except the logged in user
export const getUsersForSidebar = async (req,res) =>{
    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:userId}}).select("-password");

        // count number of messages not seen
        const unseenMessages ={};
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId : user._id,receiverId:userId, seen:false})
            if(messages.length >0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMessages})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

// get all messages for selected User

export const getMessages = async(req,res) =>{
    try{
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId},
            ]
        }).sort({createdAt: 1});
        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen: true});

        res.json({success:true,messages})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
       
    }
}

// api to mark message as seen using message id

export const markMessageAsSeen = async (req,res)=>{
    try{
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

// send message to selected user

export const sendMessage = async(req,res) =>{
    try{
        const {text,image} =req.body;
        const receiverId = req.params.id;
        const senderId  =req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('senderId', 'fullName profilePic')
            .populate('receiverId', 'fullName profilePic');

        const messageForSocket = {
            ...populatedMessage.toObject(),
            senderId: populatedMessage.senderId._id.toString(),
            receiverId: populatedMessage.receiverId._id.toString()
        };
        
        // emit the new message to the receivers socket
        const receiverSocketId = userSocketMap[receiverId];
        const senderSocketId = userSocketMap[senderId];

        
        // emit to receiver
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", messageForSocket);
        }
        // emit to sender (for multi-device sync)
        if(senderSocketId){
            io.to(senderSocketId).emit("newMessage", messageForSocket);
        }

        res.json({success:true,newMessage: messageForSocket});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}