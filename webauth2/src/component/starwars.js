import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

const Card = styled.div`
    color: rgb(12, 211, 5);
    font-size: 20px;
    border: 2px double chocolate;
    border-radius: 20px;
    margin: 5px;
    padding: 5px;
    background-image: URL('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNh9wBs3Ag5AHHwOwJR2hcQCiMc1jIP6bitH-9Zp8WKZSlKCKnSw');
    opacity: 0.6;
    &:hover {   
        background: transparent; 
        color: blue;
        border: 2px double chocolate;}
`;


const StarWars = props => {
    return (
        <CardContainer>
        {props.sith.map(char => {
            return (
                <Card key = {char.title}>
                    <h2> {char.title}</h2>
                    <p>Name: {char.name}</p>
                    <p>Birth Year: {char.birth_year}</p>
                    <p>Gender: {char.gender}</p>
                    <p>Homeworld: {char.homeworld}</p>
                    <p>Species: {char.species}</p>
                </Card>
        
        )})}
        </CardContainer>
    );
};

export default StarWars;