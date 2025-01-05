import styled from "styled-components";
import colors from "../../utils/style/colors";
import { useState, useEffect, useContext } from "react";
import Post from "../../components/Post";
import Image from "../../components/Image";
import Loader from "../../utils/style/Loader";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/context/AuthContext";
import { ErrorContext } from "../../utils/context/ErrorContext";
import { LoaderContext } from "../../utils/context/LoaderContext";
import { Link } from "react-router-dom";

const PostContainerLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    min-height: 800px;
    border-radius: 15px;
    margin-bottom: 30px;
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

const PostContainer = styled.div`
    padding: 20px;
    padding-right: 30px;
    padding-left: 30px;
    margin-bottom: 15px;
    border-radius: 10px;
    width: 60%;
    @media (max-width: 768px) {
        width: 80%;
    }
    @media (max-width: 480px) {
    }
`;

const GreyLine = styled.div`
    height: 2px;
    background-color: ${colors.primary};
`;


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
        width: 40%;
        
    }
    @media (max-width: 480px){
        
    }
`   

const SinglePost = () => {
    const [singlePostData, setSinglePostData] = useState(null)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const { isLoaded, setIsLoaded } = useContext(LoaderContext)
    const { auth } = useContext(AuthContext)
    const { id } = useParams()
    const { error, setError } = useContext(ErrorContext)
    const [isOwner, setIsOwner] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:5000/groupomania/posts/${id}`)

                const data = await response.json()

                if (response.ok) {
                    setIsLoaded(true)
                    console.log("Successfully retrieved the post", data)
                    setSinglePostData(data.post)
                } else {
                    console.error(data)
                    setError(data.error || "An error occurred")
                }
            } catch (error) {
                console.error(error.message || error)
                setError(error.message || error)
            }
        }

        fetchPost()
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
                    setErrorMessage(data.error || "An error occurred while checking ownership")
                }
            } catch (error) {
                console.error(error.message || error)
                setErrorMessage(error.message || error)
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

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage('Post successfully deleted');
                navigate('/')
            } else {
                setErrorMessage(result.error || 'An error occurred while deleting the post');
            }

        } catch (error) {
            console.error(error.message || error);
            setErrorMessage(error.message || 'An error occurred. Please try again later.');
        }
    };

    return (
        <PostContainerLayout>
            {error ? (
                <h2>Something went wrong: {error?.message || "Unknown error occurred"}</h2>
            ) : isLoaded ? (
                singlePostData && (
                    <PostContainer key={singlePostData._id}>
                        {singlePostData.media && <Image medias={singlePostData.media} />}
                        <Post
                            _id={singlePostData._id}
                            postTitle={singlePostData.PostTitle}
                            postContent={singlePostData.PostContent}
                            createdAt={singlePostData.CreatedAt}
                        />
                    </PostContainer>
                )
            ) : (
                <Loader />
            )}

            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            
            {isOwner && (
                <>
                    <SinglePostButton to={`/updatePost/${id}`}>Update Post</SinglePostButton>
                    <SinglePostButton type="button" onClick={handleDelete}>Delete Post</SinglePostButton>
                </>
            )}
        </PostContainerLayout>
    )
}

export default SinglePost
