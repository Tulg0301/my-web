const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME_CLOUDINARY}/image/upload`;

const uploadImage = async (image) => {
  const formData = new FormData()
  formData.append("file",image)
  formData.append("upload_preset", "tulg0301_product");

  const dataApi = await fetch(url,{
    method : "post",
    body : formData,
  })

  return dataApi.json()
}

export default uploadImage
