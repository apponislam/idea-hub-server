import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_secret: process.env.JWT_SECRET,
    jwt_secret_expire: process.env.JWT_SECRET_EXPIRE,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_secret_expire: process.env.JWT_REFRESH_SECRET_EXPIRE,
    sp: {
        sp_endpoint: process.env.SP_ENDPOINT,
        sp_username: process.env.SP_USERNAME,
        sp_password: process.env.SP_PASSWORD,
        sp_prefix: process.env.SP_PREFIX,
        sp_return_url: process.env.SP_RETURN_URL,
    },
};
