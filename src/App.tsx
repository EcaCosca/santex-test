import { ToastContainer, Bounce } from 'react-toastify';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { OrderProvider } from './context/OrderContext';

function App() {
  return (
    <OrderProvider>
      <Header />
      <ProductList />
      <ToastContainer
        position="top-right"
        autoClose={5500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </OrderProvider>
  );
}

export default App;
