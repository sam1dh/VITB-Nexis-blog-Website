import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log(
            "Database Connected"
        ));

        const DB_NAME = 'VITB-NEXIS-BLOG-WEBSITE'
        const baseUri = process.env.MONGODB_URI
        let uri
        const qIndex = baseUri.indexOf('?')
        if (qIndex === -1) {
            uri = baseUri.replace(/\/?$/, `/${DB_NAME}`)
        } else {
            uri = baseUri.slice(0, qIndex).replace(/\/?$/, `/${DB_NAME}`) + baseUri.slice(qIndex)
        }

        await mongoose.connect(uri)
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;