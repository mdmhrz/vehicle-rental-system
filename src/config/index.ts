
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

const confing = {
    connection_str: process.env.CONNECTION_STRING,
    port: process.env.PORT
}

export default confing;