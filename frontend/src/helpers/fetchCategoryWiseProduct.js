

const fetchCategoryWProduct= async(category)=>{
    const response = await fetch("http://localhost:8080/api/category-product",{
        method : "POST",
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify({
            category: category
        })
    })
    const dataApi = await response.json()
    return dataApi
}
module.exports = fetchCategoryWProduct