import styled from "styled-components"
import { useState } from "react"

const PostImgContainer = styled.div`
    width: 100%;
    max-height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 15px;
    margin-bottom: 10px;
    position: relative;
`

const PostImg = styled.img`
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    border-radius: 15px;
`

const PostVideo = styled.video`
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    border-radius: 15px;
    background-color: black;
`

const NavigationButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 2;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }

    &.left {
        left: 10px;
    }

    &.right {
        right: 10px;
    }
`


// Function to determine media type and render correct element
const renderMedia = (media) => {
    const fileType = media.MediaType;
    const fileExt =  media.MediaUrl.split('.').pop().toLowerCase();
    console.log("Media URL:", media.MediaUrl);  // Check the URL

    if (fileType === 'image' || fileType === 'gif' || fileExt === 'jpg' || fileExt === 'png') {
        return <PostImg src={media.MediaUrl} alt="Post media" />
    } 
    else if (fileExt === 'mp4' || fileExt === 'webm') {
        return <PostVideo controls autoPlay muted><source src={media.MediaUrl} type={`video/${fileExt}`} /></PostVideo>
    }
    // You can add more conditions for other types of media if needed
    return null;
}

const Image = ({medias})=>{
    const [currentIndex, setCurrentIndex] = useState(0)
    
    // Function to increment currentIndex media depending on user action
    const goToNext = ()=>{
        setCurrentIndex((prevIndex) => (prevIndex + 1) % medias.length)
    }
    
    // Function to decrement currentIndex media depending on user action
    const gotToPrevious = ()=>{
        setCurrentIndex((prevIndex) => (prevIndex - 1 + medias.length) % medias.length)
    }

    return (
        <PostImgContainer>
            {medias.length > 0 && (
                <>
                    {renderMedia(medias[currentIndex])}

                    {currentIndex > 0 && (
                        // Left arrow logic directly in HTML
                        <NavigationButton className="left" onClick={gotToPrevious}>
                            &#9664;
                        </NavigationButton>
                    )}

                    {currentIndex < medias.length -1 && (
                        // Right arrow logic directly in HTML
                        <NavigationButton className="right" onClick={goToNext}>
                            &#9654;
                        </NavigationButton>
                    )}
                </>
            )}
        
        </PostImgContainer>
    )
}

export default Image
