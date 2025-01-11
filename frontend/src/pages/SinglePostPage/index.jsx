import styled from "styled-components";
import colors from "../../utils/style/colors";
import { useState, useEffect, useContext } from "react";
import Image from "../../components/Image";
import Loader from "../../utils/style/Loader";
import SinglePost from "../../components/SinglePost";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../utils/context/AuthContext";
import { ErrorHandlingContext } from "../../utils/context/ErrorHandlingContext";
import { LoaderContext } from "../../utils/context/LoaderContext";
import { Link } from "react-router-dom";

const PostContainerLayout = styled.div`
    padding-top: 30px;
    margin-right: 15%;
    margin-left: 15%;
    padding-bottom: 50px;

    @media (max-width: 768px){
        margin-right: 40px;
        margin-left: 40px;
    }
    @media (max-width: 480px){
        margin-right: 20px;
        margin-left: 20px;
    }
`;

const PostContainer = styled.div`
    width: 100%;
    padding: 30px;
    border-radius: 15px;
    background-color: ${colors.backgroundSecondary};
    position: relative;

    @media (max-width: 768px) {
        padding-right: 10px;
        padding-left: 10px;
    }
    @media (max-width: 480px) {
        padding-right: 0;
        padding-left: 0;
    }
`;

const SinglePostButtonContainer = styled.div`
    padding: 15px;
    width: 100%;
    display: flex;
    gap: 10px;
    text-align: center;

    @media (max-width: 768px){
        padding: 0;
        padding-top: 15px;
        flex-direction: column;
        justify-content: center;
        align-items: center;        
    }
    @media (max-width: 480px){
        
    }
`

const SinglePostButton = styled(Link)`
    all: unset;
    padding: 15px;
    cursor: pointer;
    color: white;
    background-color: ${colors.primary};
    border-radius: 30px;
    &:hover{
        background-color: ${colors.fifth}
    }

    @media (max-width: 768px){        
        width: 180px;
    }
    @media (max-width: 480px){
        
    }
`   

const SinglePostPage = () => {
    const [singlePostData, setSinglePostData] = useState(null)
    const { isLoading, setIsLoading } = useContext(LoaderContext)
    const { auth } = useContext(AuthContext)
    const { id } = useParams()
    const {errorMessage, ErrorMessage, setErrorMessage, successMessage, setSuccessMessage, SuccessMessage} = useContext(ErrorHandlingContext)
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        //Reset error message context
        setErrorMessage('')
        setSuccessMessage('')

        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:5000/groupomania/posts/${id}`)

                const data = await response.json()

                if (response.ok) {
                    setIsLoading(false)
                    console.log("Successfully retrieved the post", data)
                    setSinglePostData(data.post)
                } else {
                    setIsLoading(false)
                    console.error(data)
                    setErrorMessage("An error occurred while fetching the post")
                }
            } catch (error) {
                setIsLoading(false)
                console.error(error.message || error)
                setErrorMessage("An error occurred while fetching the post")
            }
        }

        const sendIsReadToBackend = async ()=>{
            try{
                const response = await fetch(`http://localhost:5000/groupomania/posts/${id}/isRead`, {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.token}`
                    },
                    body: JSON.stringify({isRead: 1})
                })

                const data = await response.json()

                if(response.ok){
                    console.log('Successfully updated isRead for this post', data)
                }else{
                    console.error(data.error)
                }

            }catch(error){
                console.error(error.message || error)                
            }
        }

        fetchPost()
        sendIsReadToBackend()
    }, [id])

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const response = await fetch(`http://localhost:5000/groupomania/posts/${id}/check`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`, // Use token for authentication
                    },
                })

                const data = await response.json()

                if (response.ok) {
                    console.log("Ownership check successful:", data)
                    setIsOwner(data.isCreator) // Set ownership status
                } else {
                    console.error(data)
                }
            } catch (error) {
                console.error(error.message || error)
            }
        }

        if (auth?.token) {
            checkOwnership()
        }
    }, [id, auth?.token])

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/groupomania/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                body: JSON.stringify({account_id: auth._id})
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Post successfully deleted');
                setErrorMessage("")
            } else {
                console.error(data)
                setErrorMessage('An error occurred while deleting the post');
                setSuccessMessage("")
            }

        } catch (error) {
            console.error(error.message || error);
            setErrorMessage('An error occurred while deleting the post');
            setSuccessMessage("")
        }
    };

    return (
        <PostContainerLayout>
                {isLoading ? (
                        <Loader />
                ) : singlePostData && (
                    
                        <PostContainer key={singlePostData._id}>
                            {singlePostData.media && <Image medias={singlePostData.media} />}
                            <SinglePost
                                postTitle={singlePostData.PostTitle}
                                postContent={singlePostData.PostContent}
                                createdAt={singlePostData.CreatedAt}
                            />
                        </PostContainer>                    
                )}

                {successMessage && <SuccessMessage/>}
                {errorMessage && <ErrorMessage/>}

                
                {isOwner && (
                    <SinglePostButtonContainer>
                        <SinglePostButton to={`/updatePost/${id}`}>Update Post</SinglePostButton>
                        <SinglePostButton type="button" onClick={handleDelete}>Delete Post</SinglePostButton>
                    </SinglePostButtonContainer>
                )}
        </PostContainerLayout>
    )
}

export default SinglePostPage
