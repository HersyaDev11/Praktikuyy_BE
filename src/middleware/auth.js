import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET){
  console.error('Fatal: jwt belum di set di .env');
  process.exit(1);
}

// cek user sudah login atau belum
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error : "Token required"});
    }

    try{
        const token = authHeader.split(' ')[1];
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    }catch(error){
        return res.status(401).json({error: "Invalid token"});
    }
};

// cek apakah role user diizinkan
export const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({error : "Forbidden"});
        }
        next();
    };
};