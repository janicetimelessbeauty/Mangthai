import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import Logo from "../assets/logo.svg"
import axios from 'axios'
import { getSaveDataRoute, loadDataRoute } from '../utils/APIRoute'
const Contact = ({contacts, currentUser, changeChat}) => {
    const [currentUserName, setCurrentuserName] = useState(undefined)
    const [currentUserImage, setCurrentuserImage] = useState(undefined)
    const [currentSelected, setCurentSelected] = useState(undefined)
    const [busytime, setbusytime] = useState("23:00")
    const [endbusytime, setendbusytime] = useState("23:00")
    const [advice, setAdvice] = useState("")
    const [onmode, setonmode] = useState(false)
    const [busyset, setbusyset] = useState("")
    const [endbusyset, setendbusyset] = useState("")
    const handleHideShow = () => {
        setonmode(!onmode)
    }
    const handlebusy = () => {
        setonmode(true)
    }
    useEffect(() => {
        if(currentUser) {
            setCurrentuserName(currentUser.username)
            setCurrentuserImage(currentUser.avatarImage)

        }
    }, [currentUser])
    useEffect(() => {
        handleLoadData();
    })
    const changeCurrentChat = (index, contact) => {
        setCurentSelected(index);
        changeChat(contact);
    }
    const handleSaveData = async () => {
        console.log(currentUser._id)
        const {data} = await axios.post(`${getSaveDataRoute}/${currentUser._id}`, {
             busytime1: busytime,
             endbusytime1: endbusytime,
        })
        console.log({data})
        handleLoadData();
    }
    const handleLoadData = async () => {
        const {data} = await axios.get(`${loadDataRoute}/${currentUser._id}`)
        console.log(data[0].busytime)
        setbusyset(data[0].busytime)
        setendbusyset(data[0].endbusytime)
    }
  return (
    <>
    {
    currentUserImage && currentUserName && (
        <Container>
            <div className="brand">
                <img src={Logo} alt="" />
                <h3>Goro</h3>
            </div>
            <div className="contacts">
                {
                    contacts.map((contact, index) => {
                        return (
                            <div key = {index} className={`contact ${index === currentSelected ? "selected" : ""}` 
                            } onClick = {() => changeCurrentChat(index, contact)}>
                                <div className="avatar">
                                    <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                                </div>
                                <div className="username">
                                    <h3>{contact.username}</h3>
                                </div>
                            </div>
                  
                        )
                    })
                }
                { onmode && <div className = "busy-mode">
       <div className='box' >
         <img className = "delete" onClick = {handleHideShow} src = "https://w7.pngwing.com/pngs/871/638/png-transparent-delete-button-symbol-icon-sign-remove-round-cross.png" />
         <div className = "title">Add your busy time</div>
         <div>From</div>
         <input type = "time" value = {busytime} className = "busy-input1" onChange = {(e) => setbusytime(e.target.value)}/>
         <div>To</div>
         <input type = "time" value = {endbusytime} className = "busy-input1" onChange = {(e) => setendbusytime(e.target.value)}/>
         <button className = "btn" onClick = {handleSaveData}>Save</button>
        </div>
      </div>}
            </div>
            <div className="current-user">
                <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                </div>
                <div className="username">
                  <h2>{currentUserName}</h2>
                 </div>
                 <div className='busie'>
                 <img onClick = {handlebusy} src="https://www.grab.com/vn/wp-content/uploads/sites/11/2020/12/MEX-Tools-to-Manage-Busy-Periods-Busy-Mode-VN_edm-Section-2-icon-1.png" alt="" className = "busyselect" />
                 <span>Busy Mode : from {busyset} to {endbusyset}</span>
                 </div>
                
            </div>
        </Container>
    )
   }
    </>

)
}
export default Contact
const Container = styled.div`
display: grid;
grid-template-rows: 10% 75% 15%;
overflow: hidden;
background-color: #080420;
.brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
        height: 2rem;
    }
    h3 {
        color: pink;
        text-transform: uppercase;
    }
}
.contacts {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #ffffff39;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
    .busy-mode {
        position: absolute;
        left: -20%;
        .box {
        position: relative;
        padding: 0.5rem;
        width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid white;
        border-radius: 1rem;
        background-color: #BCCCF3;
        box-shadow: 1px 2px 2px rgba(68, 68, 68, 0.6);
        .btn {
            background-color: #fdac53;
            color: #00a170;
            width: 90px; 
            border-radius: 10px;
            border: 1px solid white;
            font-size: 19px;
            padding: 6px;
            margin: 0.5rem;
        }
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        .delete {
            cursor: pointer;
            justify-content: flex-end;
            position: absolute;
            right: 2%;
            top: 2%;
            width: 30px;
            height: 30px;
            object-fit: cover;
        }
        .title {
            font-size: 1.5rem;
            color: #5B682B;
            font-family: Garamond, serif;
            margin: 0.25rem;
        }
        .busy-input1 {
            width: 50%;
            height: 35px; 
            margin: 0.5rem; 
        }
      }
    
    }
    .contact {
        background-color: #ffffff39;
        min-height: 5rem;
        width: 90%;
        cursor: pointer;
        border-radius: 0.2rem;
        padding: 0.4rem;
        gap: 1rem;
        display: flex;
        align-items: center;
        transition: 0.5s ease-in-out;
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
    .selected {
        background-color: #9186f3;
    }
    
}
.current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .busie {
        display: flex;
        gap: 0.5rem;
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
    
    .avatar {
        img {
            height: 4rem;
            max-inline-size: 100%;
        }
    }
    .username {
        h2 {
            color: white;
        }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        gap: 0.5rem;
        .username {
            h2 {
                font-size: 1rem;
            }
        }
    }
}

`