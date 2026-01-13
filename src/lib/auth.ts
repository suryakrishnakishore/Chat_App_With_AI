import JWT from "jsonwebtoken";

export function getAuthUser(req: Request) {
    const authHeader = req.headers.get("authorization");
    console.log("AuthHeader: ", authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return null;

    const token = authHeader.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET!);

    return decoded; // { id, email }
}
