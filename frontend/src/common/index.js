const backendDomain = "http://localhost:8080"

const SummaryApi = {
    signUp : {
        url :`${backendDomain}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomain}/api/signin`,
        method : "post"

    },
    logOut : {
        url :`${backendDomain}/api/userLogout`,
        method : "GET"
    },
    allUser : {
        url : `${backendDomain}/api/all-user`,
        method : "GET"
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method : "POST"
    },
    uploadProduct : {
        url : `${backendDomain}/api/upload-product`,
        method : "POST"
    },
    allProduct : {
        url : `http://localhost:8080/api/get-product`,
        method : "GET"
    }
}

export default SummaryApi