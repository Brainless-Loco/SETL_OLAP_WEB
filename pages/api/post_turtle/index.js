const handler = async (req, res) => {
    if(req.method == "POST") await uploadFile()
}

export default handler