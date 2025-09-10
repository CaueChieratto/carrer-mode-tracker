import { useEffect, useState } from "react";
import { AuthService } from "../../common/services/Auth/AuthService";
import Button from "../../components/Button";
import ContainerButton from "../../components/ContainerButton";
import ContainerIcon from "../../components/ContainerIcon";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Styles from "./Login.module.css";
import { GoLock } from "react-icons/go";
import { MdOutlineEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/CareersPage");
    }
  }, [navigate]);

  function linkCareersPage() {
    navigate("/CareersPage");
  }

  const handleAuthError = (err: unknown) => {
    let message = "Ocorreu um erro. Por favor, tente novamente.";
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/invalid-email":
          message = "O e-mail fornecido não é válido.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "E-mail ou senha incorretos.";
          break;
        case "auth/email-already-in-use":
          message = "Este e-mail já está em uso.";
          break;
        case "auth/weak-password":
          message = "A senha precisa ter pelo menos 6 caracteres.";
          break;
        default:
          message = "Erro de autenticação. Verifique suas credenciais.";
      }
    }
    alert(message);
  };

  const handleLogin = async () => {
    try {
      await AuthService.login(email, password);
      linkCareersPage();
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleRegister = async () => {
    try {
      await AuthService.register(email, password);
      linkCareersPage();
    } catch (err) {
      handleAuthError(err);
    }
  };

  return (
    <div className={Styles.login}>
      <h1 className={Styles.h1}>Faça seu Login</h1>
      <Label htmlFor="email">
        <ContainerIcon color="black" className={Styles.icon}>
          <MdOutlineEmail size={18} />
        </ContainerIcon>
        <Input
          className={Styles.input}
          placeholder="Email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Label>
      <Label htmlFor="password">
        <ContainerIcon color="black" className={Styles.icon}>
          <GoLock size={18} />
        </ContainerIcon>
        <Input
          className={Styles.input}
          placeholder="Senha"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Label>
      <ContainerButton className={Styles.containerButtons}>
        <Button onClick={handleLogin} typeButton="primary">
          Entrar
        </Button>
        <Button onClick={handleRegister} typeButton="secondary">
          Criar Conta
        </Button>
      </ContainerButton>
    </div>
  );
};

export default Login;
