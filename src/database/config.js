import mongoose from "mongoose";

export const conecctionDB = async () => {
        try {
                await mongoose.connect(
                        "mongodb+srv://sebastianjzeballos:CoderCoder@cluster0.eg1iy27.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
                        {
                                dbName: "coderProyect"
                        }
                )
                console.log("DB conectada!!")

        } catch (error) {
                console.log("Error al conectar a la Base de Datos", error.message)
        }
}