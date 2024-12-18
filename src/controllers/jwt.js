const jwt = require("jsonwebtoken");

async function generateToken(request, response) {
  try {
    const payload = request.body;

    let token;

    let refreshToken;

    console.log("NO_EXPIRATION", process.env.NO_EXPIRATION)
    if (process.env.NO_EXPIRATION) {
      token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      console.log("token sem expiracao");
      refreshToken = jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET);
    } else {
      console.log("ACCESS_TOKEN_LIFETIME", process.env.ACCESS_TOKEN_LIFETIME)
      console.log("REFRESH_TOKEN_LIFETIME", process.env.REFRESH_TOKEN_LIFETIME)

      token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
      });
      console.log("com expiracao");
      refreshToken = jwt.sign({ payload }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
      });
    }

    return response.status(200).json({
      success: true,
      access_token: token,
      refresh_token: refreshToken,
    });
  } catch (error) {
    return response.status(401).json({
      success: false,
      error: error,
    });
  }
}

async function validateToken(request, response) {
  try {
    const access_token =
      request.body.access_token ||
      request.headers.authorization?.replace("Bearer", "").trim();
    if (!access_token) {
      if (process.env.ALLOW_ANONYMOUS === "true") {
        return response.status(200).json({ "X-Hasura-Role": "anonymous" });
      }
      console.log(decoded);
      delete decoded["iat"];
      delete decoded["exp"];
      // Object.entries(decoded).forEach(entry=> {
      //     response.set(entry[0], entry[1].toString())
      // })

      return response
        .status(401)
        .json({ success: false, message: "Nenhum token enviado" });
    }

    jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.log("ERROR:", err);

          return response.status(401).json({
            success: false,
            message: "Falha na autenticação.",
            error: err,
          });
        }
        delete decoded["iat"];
        delete decoded["exp"];
        // Object.entries(decoded).forEach(entry=> {
        //     response.set(entry[0], entry[1].toString())
        // })

        return response.status(200).json(decoded);
      }
    );
  } catch (error) {
    console.log(error);
    if (process.env.ALLOW_ANONYMOUS === "true") {
      return response.status(200).json({ "X-Hasura-Role": "anonymous" });
    }
    return response.status(401).json({ success: false, error: error });
  }
}

async function refreshToken(request, response) {
  try {
    let { refresh_token, payload } = request.body;
    if (!refresh_token)
      return response.status(401).json({
        success: false,
        message: "Token de Longa duração não enviado",
      });

    if (!payload) payload = jwt.decode(refresh_token).payload;

    if (!payload)
      return response
        .status(401)
        .json({ success: false, message: "Payload não enviado" });

    try {
      jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return response.status(401).json({ success: false, error: error });
    }
    let newToken;
    if (process.env.NO_EXPIRATION) {
      newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    } else {
      newToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
      });
    }

    console.log(refresh_token, payload, newToken);
    return response.status(200).json({
      success: true,
      access_token: newToken,
    });
  } catch (error) {
    console.log(error);
    return response.status(401).json({ success: false, error: error });
  }
}

module.exports = {
  generateToken,
  validateToken,
  refreshToken,
};
