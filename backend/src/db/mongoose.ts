import config from "config";
import mongoose from "mongoose";

const { host, port, database } = config.get<{ host: string, port: number, database: string }>('mongoose')

export async function connect() {
    try {
        await mongoose.connect(`mongodb://${host}:${port}/${database}`)
        console.log('*********************************************************************')
        console.log('*********************** connected to mongo **************************')
        console.log('*********************************************************************')
    } catch (e) {
        console.log(e)
    }
}

export default mongoose