import styled from "styled-components"
import colors from "../../utils/style/colors"
import { useState, useContext} from "react"
import { AuthContext } from "../../utils/context/AuthContext"

const Wrapper = styled.div`
    padding-bottom: 30px;
`

const CreatePostContainer = styled.div`
    padding: 20px;
    padding-top: 100px;
    background-color: ${colors.backgroundSecondary};
    border-radius: 10px;
    position: relative;
    min-height: 450px;

    @media (max-width: 768px) {
        padding-top: 0;
    }
`

const CreatePostWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
`

const CreatePostTitle = styled.h2`
    color: ${colors.sixth};
    position: absolute;
    top: 10px;
    left: 50px;

    @media (max-width: 768px) {
        position: relative;
        top: 0;
        left: 0;
        padding-bottom: 15px;
    }
`

const InputGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const InputLabel = styled.label`
    color: ${colors.sixth};
    font-size: 16px;
`

const InputField = styled.input`
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid ${colors.fourth};
`

const TextAreaField = styled.textarea`
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid ${colors.fourth};
    resize: none;
`

const FileInput = styled.input`
    margin-top: 10px;
`

const SubmitButton = styled.button`
    background-color: ${colors.primary};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background-color: ${colors.fifth};
    }
`

const ErrorMessage = styled.p`
    color: red;
`

const SuccessMessage = styled.p`
    color: green;
`





const CreatePost = ()=>{
    const { auth } = useContext(AuthContext)
    const [postTitle, setPostTitle] = useState("")
    const [postContent, setPostContent] = useState("")
    const [mediaFiles, setMediaFiles] = useState({ image: [], video: [], gif: [] })
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
  
    const handleTitleChange = (e) => setPostTitle(e.target.value)
    const handleContentChange = (e) => setPostContent(e.target.value)

    const handleFileChange = (e) => {
        const { name, files } = e.target
        setMediaFiles((prevFiles) => ({
            ...prevFiles,
            [name]: [...prevFiles[name], ...Array.from(files)], 
        }))
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
    
        const formData = new FormData()
        formData.append("post", JSON.stringify({ PostTitle: postTitle, PostContent: postContent, account_id: auth._id }))
        
        if (mediaFiles.image.length > 0) {
            Array.from(mediaFiles.image).forEach((file) => {
                formData.append("image", file)
            })
        }
        if (mediaFiles.video.length > 0) {
            Array.from(mediaFiles.video).forEach((file) => {
                formData.append("video", file)
            })
        }
        if (mediaFiles.gif.length > 0) {
            Array.from(mediaFiles.gif).forEach((file) => {
                formData.append("gif", file)
            })
        }
    
        const body = mediaFiles.image.length > 0 || mediaFiles.video.length > 0 || mediaFiles.gif.length > 0
            ? formData
            : JSON.stringify({ PostTitle: postTitle, PostContent: postContent, account_id: auth._id })
    
        const headers = {
            Authorization: `Bearer ${auth.token}`,
        }
    
        // Conditionally set Content-Type based on the body type
        if (!(mediaFiles.image.length > 0 || mediaFiles.video.length > 0 || mediaFiles.gif.length > 0)) {
            headers['Content-Type'] = 'application/json'
        }
    
        try {
            const response = await fetch("http://localhost:5000/groupomania/posts", {
                method: "POST",
                headers: headers,
                body: body,
            })
    
            const data = await response.json()
    
            if (response.ok) {
                console.log(data)
                setSuccessMessage("Post created successfully")
                setPostTitle("")
                setPostContent("")
                setMediaFiles({ image: [], video: [], gif: [] })
            } else {
                const errorMessage = data?.error?.message || "An unknown error occurred"
                setError(errorMessage)
            }
        } catch (error) {
            setError("An error occurred while submitting the post. Please try again later.")
            console.error(error.message || error)
        }
    }
    
    
    return (
        <Wrapper>
            <CreatePostContainer>
            <CreatePostWrapper>
                <CreatePostTitle>Create a New Post</CreatePostTitle>

                <InputGroup>
                    <InputLabel htmlFor="postTitle">Title</InputLabel>
                    <InputField
                        id="postTitle"
                        type="text"
                        value={postTitle}
                        onChange={handleTitleChange}
                        placeholder="Enter post title"
                        required
                    />
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="postContent">Content</InputLabel>
                    <TextAreaField
                        id="postContent"
                        value={postContent}
                        onChange={handleContentChange}
                        placeholder="Enter post content"
                        required
                    />
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="image">Images (max 5)</InputLabel>
                    <FileInput
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    {mediaFiles.image.map((file, index) => (
                        <p key={index}>{file.name}</p>
                    ))}

                    <InputLabel htmlFor="video">Video (max 1)</InputLabel>
                    <FileInput
                        id="video"
                        name="video"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                    />

                    <InputLabel htmlFor="gif">GIF (max 1)</InputLabel>
                    <FileInput
                        id="gif"
                        name="gif"
                        type="file"
                        accept="image/gif"
                        onChange={handleFileChange}
                    />
                </InputGroup>

                {error && <ErrorMessage>{String(error)}</ErrorMessage>}
                {successMessage && <SuccessMessage>{String(successMessage)}</SuccessMessage>}

                <SubmitButton type="submit" onClick={handleSubmit}>
                    Create Post
                </SubmitButton>
            </CreatePostWrapper>
        </CreatePostContainer>
        </Wrapper>
    )
}

export default CreatePost
