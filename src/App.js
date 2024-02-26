import { GlobalStyle } from "./style/globalStyles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/auth";

function App() {

  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer autoClose={3000} position={toast.POSITION.TOP_CENTER} />
      <GlobalStyle />
    </AuthProvider>
  )
}

export default App;
