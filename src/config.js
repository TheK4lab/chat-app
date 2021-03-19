module.exports = {
    // MONGO DB PARAMETERS
    connectionURL = "mongodb://localhost:27017/chatAppDB",

    // EXPRESS PARAMETERS
    PORT = 3000 || process.env.PORT,

    // JWT PARAMETERS
    jwtSecret: "asupersecretkey"
}