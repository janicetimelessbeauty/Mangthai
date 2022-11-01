import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import Logout from './Logout'
import ChatInput from './ChatInput'
import Messages from './Messages'
import axios from "axios"
import { getAllMessageRoute, getSaveDataRoute, sendMessageRoute, loadDataRoute } from '../utils/APIRoute'
import {v4 as uuidv4} from "uuid"
const ChatContainer = ({currentChat, currentUser, socket}) => {
    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [busytime, setbusytime] = useState("23:00")
    const [endbusytime, setendbusytime] = useState("23:00")
    const [advice, setAdvice] = useState("")
    const [busyset, setbusyset] = useState("")
    const [endbusyset, setendbusyset] = useState("")
    const scrollRef = useRef()
    const getAllMessage = async () => {
        const response = await axios.post(getAllMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
        })
        setMessages(response.data)
    }
    const handleLoadData = async () => {
        const {data} = await axios.get(`${loadDataRoute}/${currentChat._id}`)
        console.log(data[0].busytime)
        setbusyset(data[0].busytime)
        setendbusyset(data[0].endbusytime)
    }
    useEffect(() => {
       if(currentChat && currentUser) {
        getAllMessage();
       }
    }, [currentChat])
    useEffect(() => {
        if(currentChat && currentUser) {
        handleLoadData()
        }
    }, [currentChat])
    const handleSendMsg = async (msg) => {
       const {data} = await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
       })
       socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg
       })
       let data1 = data.split(":")
       let num1 = parseInt(data1[0])
       let num2 = parseInt(data1[1])
       if (num2 < 10) {
         num2 = "0" + num2
       }
       let finaldata = parseInt(num1 + "" + num2)
       let busytime1 = busyset.split(":")
       let busytime2 = parseInt(busytime1[0])
       let busytime3 = parseInt(busytime1[1])
       if (busytime3 < 10) {
        busytime3 = "0" + busytime3
      }
       let finalbusytime = parseInt(busytime2 + "" + busytime3)
       let endbusytime1 = endbusyset.split(":")
       let endbusytime2 = parseInt(endbusytime1[0])
       let endbusytime3 = parseInt(endbusytime1[1])
       if (endbusytime3 < 10) {
        endbusytime3 = "0" + endbusytime3
      }
       let finalendbusytime = parseInt(endbusytime2 + "" + endbusytime3)
       console.log(finaldata)
       if (finaldata >= finalbusytime  && finaldata <= finalendbusytime) {
        setAdvice("The current receiver is usually busy right now.")
        console.log(advice)
       }
       else if (finalendbusytime < finalbusytime) {
          let finalendbusytime1 = parseInt(finalendbusytime) + 2400
          let finaldata1 = parseInt(finaldata) + 2400
          if (finaldata1 >= finalbusytime  && finaldata1 <= finalendbusytime1) {
            setAdvice("The current receiver is usually busy right now.")
            console.log(advice)
           }
       }
       else {
        setAdvice("")
       }
       const msgs = [...messages]
       msgs.push({fromSelf: true, message: msg})
       setMessages(msgs)
    }
    const handleAdvice = () => {
        setAdvice("")
    }
    useEffect(() => {
        if(socket.current) {
            socket.current.on("msg-received", (msg) => {
                 setArrivalMessage({fromSelf: false, message: msg})
            })
        }
    }, [])
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])
  return (
   
    <>
    { currentChat &&
    <Container>
        <div className="chat-header">
            <div className='busie'>
            <img src="https://www.grab.com/vn/wp-content/uploads/sites/11/2020/12/MEX-Tools-to-Manage-Busy-Periods-Busy-Mode-VN_edm-Section-2-icon-1.png" alt="" className = "busyselect" />
            <span>Busy Mode : from {busyset} to {endbusyset}</span>
            </div>
            <div className="user-details">
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar"/>
                </div>
                <div className="username">
                 <h3>{currentChat.username}</h3>
                </div>
            </div>
            <Logout />
        </div>
        <div className="chat-messages">
            {
                messages.map((message) => {
                    return (
                        <div ref = {scrollRef} key = {uuidv4()}>
                            <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                                <div className="content">
                                    <p>
                                        {message.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        <ChatInput handleSendMsg = {handleSendMsg}/>
       {advice !== "" && <div className = "containers">
        <img src="https://i.gifer.com/YKcT.gif" alt="" />
        <div className='title'>Important Note</div>
        <div className = "notification">Your chatmate is in busy mode now !</div>
        <div className = "recs">You should text when they are free </div>
        <button className = "btn" onClick = {handleAdvice}>OK</button>
      </div>}
    </Container> 
    }
    </>
  )
}
const Container = styled.div `
display: grid;
position: relative;
grid-template-rows: 10% 78% 12%;
gap: 0.1rem;
overflow: hidden;
padding-top: 1rem;
@media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-auto-rows: 15% 70% 15%;
}
.containers {
   height: 200px;
   border-radius: 1rem;
   border: 1px solid white;
   display: flex;
   flex-direction: column;
   justify-content: space-around;
   align-items: center;
   background: linear-gradient(to bottom left, #EF8D9C 40%, #FFC39E 100%);
   position: absolute;
   animation: fadeIn 2s;
   left: 35%;
   top: 35%;
   @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
    }
   img {
    width: 80px;
    height: 80px;
    object-fit: cover;
   }
   .title {
     color: white;
     font-size: 25px;
     font-family:  Garamond, serif;
   }
   .notification {
    color: #6B5B95;
    font-size: 20px;
   }
   .recs {
    color: #009B77;
    font-size: 18px;
   }
   .btn {
    background: linear-gradient(to bottom right,#B0DB7D 40%, #99DBB4 100%);
    border-radius: 1rem;
    color: white;
    font-size: 16px;
    padding: 5px;
    width: 80px;
    border: none;
   }
}
.chat-header {
    position: relative;
    .busie {
    display: flex;
    justify-content: space-between;
    align-items: center;
        .busyselect {
            cursor: pointer;
            width: 40px;
            height: 40px;
            object-fit: cover;
        }
        span {
            color: white;
            font-size: 15px;
        }
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar {
            img {
                height: 3rem;
            }
        }
        .username {
            h3 {
                color: white;
            }
        }
    }
}

.chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }
    }
    .message {
        display: flex;
        align-items: center;
        .content {
            max-width: 40%;
            overflow-wrap: break-word;
            padding: 1rem;
            font-size: 1.1rem;
            border-radius: 1rem;
        }
    }
    .sended {
        justify-content: flex-end;
        .content {
            background-color: #4f04ff21;
            color: #d1d1d1;

        }
    }
    .received {
        justify-content: flex-start;
        .content {
            background-color: #ffb3d1;
            color: #669900;
        }
    }


}
`
export default ChatContainer