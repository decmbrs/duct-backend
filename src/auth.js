const AUTH_TOKEN = process.env.AUTH_TOKEN;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (req.method === 'GET') {
    return next();
  }

  if (!token) {
    return res.status(401).json({ 
      error: "Authentication required",
      message: "Требуется авторизация для выполнения этой операции" 
    });
  }

  if (token !== AUTH_TOKEN) {
    return res.status(403).json({ 
      error: "Invalid token",
      message: "Неверный токен авторизации" 
    });
  }

  next();
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === AUTH_TOKEN) {
    req.authenticated = true;
  } else {
    req.authenticated = false;
  }

  next();
};
