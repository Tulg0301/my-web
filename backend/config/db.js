
const mongoose = require('mongoose')

async function connectDB() {

    try {
        await mongoose.connect(process.env.MONGGODB_URI)
        
    } catch (error) {
        console.log(error)
        
    }
    
}
module.exports = connectDB