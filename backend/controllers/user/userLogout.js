 async function userLogout(req, res) {
    
    try {

        res.clearCookie("token")

        res.json({
            message : "Đã đăng xuất",
            success : true,
            error : false,
            data : []
            
        })
        
    } catch (error) {
        res.json({
            message: error.message || error, 
            success: false,
            error: true
        })
    }
}

module.exports =  userLogout