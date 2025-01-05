import { useState, useEffect, useContext } from "react"
import { ErrorContext } from "../../utils/context/ErrorContext"
import { LoaderContext } from "../../utils/context/LoaderContext"
import Loader from "../../utils/style/Loader"
import styled from "styled-components"
import Post from "../../components/Post"
import colors from "../../utils/style/colors"
import Image from "../../components/Image"
import { Link } from "react-router-dom"
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { AuthContext } from "../../utils/context/AuthContext"
import { FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa'


const PostContainerLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    position: relative;
    margin: 0 auto;

    @media (max-width: 768px){
        padding-right: 10px;
        padding-left: 10px;        
    }
    @media (max-width: 480px){
        padding-right: 0;
        padding-left: 0; 
    }
`

const PostContainer = styled.div`
    padding: 20px;
    padding-right: 30px;
    padding-left: 30px;
    margin-bottom: 15px;
    border-radius: 10px;
    width: 60%;
     @media (max-width: 768px){
        width: 80%;       
    }
    @media (max-width: 480px){
        
    } 
`
const GreyLine = styled.div`
    height: 2px;
    background-color: ${colors.primary}; 
`

const CreatePostButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 15px;
    padding-right: 100px;
    @media (max-width: 768px){
        width: 60%;
        justify-content: center;    
        padding-right: 0;   
    }
    @media (max-width: 480px){
        
    } 
`

const CreatePostButton = styled(Link)`
    all: unset;
    padding: 15px;
    cursor: pointer;
    color: white;
    align-self: end;
    background-color: ${colors.sixth};
    border-radius: 30px;
    &:hover{
        opacity: 0.5;
    }

    @media (max-width: 768px){
        
        
    }
    @media (max-width: 480px){
        
    }
`

const IconContainer = styled.div`
    padding: 10px;
    display: flex;
    gap: 20px;
`

const IconButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: flex;

    align-items: center;
    cursor: pointer;
`

const LikeIcon = styled(FaThumbsUp)`
    color: ${(props)=>(props.active ? colors.tertiary : 'grey')};
    font-size: 24px;


    &:hover{
        color: ${colors.tertiary};
    }
`

const DislikeIcon = styled(FaThumbsDown)`
    color: ${(props)=>(props.active ? 'red' : 'grey')};
    font-size: 24px;


    &:hover{
        color: red;
    }
`

const ReadIcon = styled(FaEnvelopeOpen)`
    color: ${(props) => (props.active ? colors.primary : 'grey')};
    font-size: 24px;

    &:hover {
        color: ${colors.primary};
    }
`

const Home = ()=>{

    // State to store fetched data
    const [postData, setPostData] = useState([])
    // Getting error context data from context
    const {error, setError} = useContext(ErrorContext)
    // Getting loader context
    const {isLoaded, setIsLoaded} = useContext(LoaderContext)
    const [reaction, setReaction] = useState({})
    const {auth} = useContext(AuthContext)
    const [readPosts, setReadPosts] = useState({})

    
    useEffect(()=>{
        const fetchPosts = async ()=>{
            try{
                const response = await fetch('http://localhost:5000/groupomania/posts')
                if(!response.ok){   
                    throw new Error(`Error fetching data ${response.status}`)
                }
                const data = await response.json()
                setPostData(data.posts)
                setIsLoaded(true)
            }catch(error){
                console.error(error.message || error)
                setError(error.message || error)
            }
        }   

        fetchPosts()
    }, [])

    const sendReactionToBackend = async (_id, reaction)=>{
        try{
            const response = await fetch(`http://localhost:5000/groupomania/posts/${_id}/reactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.token}`,
                    
                },
                body: JSON.stringify({
                    ReactionType: reaction,
                    account_id: auth._id
                })
            })

            const data = await response.json()

            if(response.ok){
                console.log('Successfully updated reaction for this post', data)
            }else{
                console.error(data)
                setError(data.error)
            }


        }catch(error){
            console.error(error.message || error)
            setError(error.message || error)
        }
    }

    const handleLike = (_id)=>{
        setReaction((prevReactions)=>{
            const newReaction = prevReactions[_id] === 1 ? 0 : 1
            sendReactionToBackend(_id, newReaction)
            return{
                ...prevReactions,
                [_id]: newReaction
            }
        })
    }

    const handleDislike = (_id)=>{
        setReaction((prevReactions)=>{
            const newReaction = prevReactions[_id] === -1 ? 0 : -1
            sendReactionToBackend(_id, newReaction)
            return{
                ...prevReactions,
                [_id]: newReaction
            }
        })
    }

    const markAsRead = (postId) => {
        setReadPosts(prev => ({
            ...prev,
            [postId]: true, 
        }));
    };

    const EnvelopeIcon = ({ postId, readStatus, markAsRead }) => {
        return (
            <div onClick={() => markAsRead(postId)}>
                {readStatus ? (
                    <FaEnvelopeOpen style={{ fontSize: '24px', color: 'green' }} />
                ) : (
                    <FaEnvelope style={{ fontSize: '24px', color: 'gray' }} />
                )}
            </div>
        );
    };


    return (
        <PostContainerLayout>  
            <CreatePostButtonContainer>
                <CreatePostButton to='/createPost'>Create my post</CreatePostButton>
            </CreatePostButtonContainer>
            

            {error ? (<h2>Something went wrong: {error?.message || "Unknown error occurred"}</h2>)
            : (                
                isLoaded ? (    
                postData.map((post)=>{                    

                    return (
                        <PostContainer key={post._id}>

                            <Image medias={post.media}/>

                            <Post _id={post._id}
                            postTitle={post.PostTitle}
                            postContent={post.PostContent}
                            createdAt={post.CreatedAt}
                            readPosts={readPosts} 
                            markAsRead={markAsRead} 
                            />

                            <IconContainer>    
                                <EnvelopeIcon
                                postId={post._id}
                                readStatus={readPosts[post._id]} 
                                markAsRead={markAsRead} 
                                /> 
                                <IconButton onClick={()=>handleLike(post._id)}>
                                    <LikeIcon active={reaction[post._id] === 1}/>
                                </IconButton>
                                <IconButton onClick={()=>handleDislike(post._id)}>
                                    <DislikeIcon active={reaction[post._id] === -1}/>
                                </IconButton>
                            </IconContainer>

                            <GreyLine/>
                        </PostContainer>                        
                    )
                })                 
                ): (
                    <Loader/>     
                )
            )     
        } 
        
        </PostContainerLayout>
    )
}

export default Home
