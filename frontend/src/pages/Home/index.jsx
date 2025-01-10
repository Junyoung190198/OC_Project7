import { useState, useEffect, useContext } from "react"
import { ErrorHandlingContext } from "../../utils/context/ErrorHandlingContext"
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
    margin-right: 30px;
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

    // State to store fetched posts's data
    const [postData, setPostData] = useState([])
    // loader context
    const {isLoading, setIsLoading} = useContext(LoaderContext)
    // Reaction state to store reaction updates
    const [reaction, setReaction] = useState({})
    // isRead state to store isRead data
    const [isRead, setIsRead] = useState(0)
    // Access token and user account's id data
    const {auth} = useContext(AuthContext)
    //Error handling context: errore and success message
    const {errorMessage, ErrorMessage, setErrorMessage} = useContext(ErrorHandlingContext)

   /**
    * Effect to run at first render to fecth all posts 
    * in the database
    */
    useEffect(()=>{
        //Reset error message context
        setErrorMessage('')

        const fetchPosts = async ()=>{
            try{
                setIsLoading(true)
                const response = await fetch('http://localhost:5000/groupomania/posts')
                const data = await response.json()

                if(response.ok){
                    setPostData(data.posts)
                    setIsLoading(false)
                    console.log("Successfully retrieved posts's data", data)
                }else{
                    setIsLoading(false)
                    setErrorMessage("An error occured when trying to fetch posts's data")
                    console.error(data.error)
                }   
                
            }catch(error){
                setIsLoading(false)
                setErrorMessage("An error occured when trying to fetch posts's data")
                console.error(error.message || error)
            }
        }   

        fetchPosts()
    }, [])

    /**
     * Effect to run at first render to fetch isRead info
     * Mark as read if this account has read the post and 
     * mark as unread if it's another account
     */
    useEffect(()=>{
        try{

        }catch(error){
            console.error(error)
        }
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
                console.error(data.error)
                setErrorMessage('An error occured when trying to update the reaction')
            }

        }catch(error){
            setErrorMessage('An error occured when trying to update the reaction')
            console.error(error.message || error)
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
                   
            {isLoading ? (    
            <Loader/>       
            ): (
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
            )}
            {errorMessage && <ErrorMessage/>}
        </PostContainerLayout>
        
    )
}

export default Home
