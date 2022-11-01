import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'
const Welcome = ({currentUser}) => {
  return (
    <Container>
        <img src = {Robot} alt = "Robot"/>
        <h1>
            Welcome, <span>{currentUser.username}!</span>
        </h1>
        <h3>Please select a friend to start messaging </h3>
    </Container>
  )
}
const Container = styled.div`
display: flex;
justify-content = center;
align-items: center;
flex-direction: column;
color: white;
gap: 0.5rem;
img {
    height: 20rem;
}
span {
    color: orange;
}
`
export default Welcome