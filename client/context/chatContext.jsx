import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";


export const ChatContext  =createContext();


export const ChatProvider =({children})=>{
    const [messages,setMessages] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] =useState({})

    const{socket ,axios,authUser} =useContext(AuthContext);

    // function to get all users for side bar
    const getUsers = async() =>{
        try{
            const {data} =await axios.get("/api/messages/users");
            if(data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

// function to get messages for selected user
    const getMessages = async (userId)=>{
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
            }
        }catch(error){
            toast.error(error.message)
        }
    } 
// function to send message to the selectedUser
    const sendMessage = async (messageData) => {
    if (!selectedUser || !selectedUser._id) {
        toast.error("No user selected");
        return;
    }

    try {
        const { data } = await axios.post(
            `/api/messages/send/${selectedUser._id}`,
            messageData
        );

        if (!data.success) {
            toast.error(data.message || "Failed to send message");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    }
};


    // function to subscribe to messages for selected user
     const subscribeToMessages = () => {
  if (!socket) return;

  // Clean up previous listener to avoid duplicates
  socket.off("newMessage");

  socket.on("newMessage", (newMessage) => {
    const isCurrentChat =
      selectedUser &&
      (newMessage.senderId === selectedUser._id ||
       newMessage.receiverId === selectedUser._id);

    if (isCurrentChat) {
      setMessages((prevMessages) => {
        const exists = prevMessages.some(
          (msg) => msg._id === newMessage._id
        );
        return exists ? prevMessages : [...prevMessages, newMessage];
      });

      // Mark as seen if the message is from the selected user
      if (newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        axios.put(`/api/messages/mark/${newMessage._id}`);
      }
    } else {
      // Store unseen count
      setUnseenMessages((prev) => ({
        ...prev,
        [newMessage.senderId]: prev[newMessage.senderId]
          ? prev[newMessage.senderId] + 1
          : 1,
      }));
    }
  });
};


    // function to unsubscribe from messages
    const unsubscribeFromMessges = ()=>{
        if(socket) socket.off("newMessage");
    }
    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessges();
    },[socket,selectedUser])

    const value = {
        messages,users,selectedUser,getUsers,getMessages,sendMessage,setSelectedUser,unseenMessages,setUnseenMessages
    }
    return (
        <ChatContext.Provider value = {value}>
            {children}
        </ChatContext.Provider>
    )
}