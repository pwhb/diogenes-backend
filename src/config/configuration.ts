export default () => ({
    port: parseInt(process.env.PORT, 10) || 5432,
    database: process.env.MONGODB_URI
});