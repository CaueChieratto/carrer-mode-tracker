import { auth } from "../../../Firebase";

export const requireAuth = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }
  return user;
};
