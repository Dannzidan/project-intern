import jwt from "jsonwebtoken"

export const verifyUser = async (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        
        req.userId = user.id
        req.uuid   = user.uuid
        req.role   = user.role
        req.name   = user.name
        req.email  = user.email

        next()
    })
}

export const jwtSign = async (username) => {
    return await jwt.sign(username, process.env.SECRET_KEY, { expiresIn: '24h' })
}

export const adminOnly = async (req, res, next) =>{
    if(req.role !== "admin") return res.status(403).json({msg: "Akses terlarang"});

    next();
}