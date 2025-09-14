import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log(
            "Database Connected"
        ));

        await mongoose.connect(`${process.env.MONGODB_URI}/VITB-NEXIS-BLOG-WEBSITE`)
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;