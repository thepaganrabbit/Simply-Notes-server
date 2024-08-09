export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.MONGO_HOST,
      port: parseInt(process.env.MONGO_PORT, 10) || 27017,
      pwd: process.env.MONGO_PWD,
      username: process.env.MONGO_USR

    }
  });