import confing from "./config"
import app from "./app"
const port = confing.port

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})