// ─── AppContext.jsx ────────────────────────────────────────────────────────────
// Global state management using React Context.
// Auth hits the Laravel API. Products are fetched from / saved to MySQL.
// WebSocket (Laravel Echo + Reverb) keeps products in sync in real time.
//
// Prof slide reference:
//  "WebSockets enable real-time, live-updating user interfaces."
//  "When server data changes, a message is sent over a WebSocket connection."
//  "The client receives the event in JavaScript."
//  "A notification is displayed without refreshing the page."

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { orders as initialOrders } from "./data/orders";
import { users  as initialUsers  } from "./data/users";
import { authApi }     from "./api/auth";
import { productsApi } from "./api/products";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("ruado_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem("ruado_token", data.token);
    localStorage.setItem("ruado_user", JSON.stringify(data.user));
    setCurrentUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, passwordConfirmation) => {
    await authApi.register(name, email, password, passwordConfirmation);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch (_) {}
    localStorage.removeItem("ruado_token");
    localStorage.removeItem("ruado_user");
    setCurrentUser(null);
  };

  // ── Products (from DB) ────────────────────────────────────────────────────
  const [products,        setProducts]        = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError,   setProductsError]   = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    if (!currentUser) return;
    setProductsLoading(true);
    setProductsError(null);
    try {
      const data = await productsApi.getAll(params);
      setProducts(data.products);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) fetchProducts();
  }, [currentUser, fetchProducts]);

  const addProduct = async (product) => {
    const data = await productsApi.create(product);
    setProducts(prev => [...prev, data.product]);
    return data.product;
  };

  const updateProduct = async (id, updates) => {
    const data = await productsApi.update(id, updates);
    setProducts(prev => prev.map(p => p.id === id ? data.product : p));
    return data.product;
  };

  const deleteProduct = async (id) => {
    await productsApi.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ── WebSocket Broadcasting (Laravel Echo + Reverb) ────────────────────────
  // Prof slide:
  //  "WebSockets are more efficient than continuous polling."
  //  "They maintain a persistent connection."
  //  "They avoid repeated HTTP requests."
  //  "Frontend listens and reacts instantly when events are received."
  const echoRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    // Lazy-import Echo to avoid errors when Reverb isn't running in dev
    import("./echo.js")
      .then(({ default: echo }) => {
        echoRef.current = echo;

        // Subscribe to the public 'inventory' channel
        // "Clients connect to named channels on the frontend."
        echo.channel("inventory")
          .listen(".product.updated", (event) => {
            // "A notification is displayed without refreshing the page."
            const { action, product, product_id } = event;

            if (action === "created" && product) {
              setProducts(prev => {
                // Avoid duplicates (our own mutation already added it)
                if (prev.find(p => p.id === product.id)) return prev;
                return [...prev, product];
              });
            }

            if (action === "updated" && product) {
              setProducts(prev => prev.map(p => p.id === product.id ? product : p));
            }

            if (action === "deleted") {
              setProducts(prev => prev.filter(p => p.id !== product_id));
            }
          });
      })
      .catch(() => {
        // Echo/Reverb not available — silent fallback, REST API still works
        console.info("NYX: WebSocket unavailable — using REST API only.");
      });

    return () => {
      // Cleanup: leave channel when user logs out
      echoRef.current?.leaveChannel("inventory");
    };
  }, [currentUser]);

  // ── Orders ────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState(initialOrders);

  const addOrder = (order) => {
    const newOrder = { ...order, id: `ORD-${String(Date.now()).slice(-4)}`, time: "Just now", status: "Pending" };
    setOrders(prev => [newOrder, ...prev]);
  };
  const updateOrderStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  const deleteOrder = (id) => setOrders(prev => prev.filter(o => o.id !== id));

  // ── Users ─────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState(initialUsers);

  const addUser = (user) => {
    const newUser = {
      ...user, id: Date.now(), orders: 0,
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      avatar: `${user.name.split(" ")[0][0]}${user.name.split(" ")[1]?.[0] ?? ""}`.toUpperCase(),
    };
    setUsers(prev => [...prev, newUser]);
  };
  const updateUser = (id, updates) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  // ── Settings ──────────────────────────────────────────────────────────────
  const [settings, setSettings] = useState({
    displayName: "", email: "", password: "", twoFA: false,
    emailAlerts: true, lowStockAlert: true, lowStockThreshold: 5,
    orderUpdates: true, theme: "Netflix Dark", language: "English (PH)", timezone: "Asia/Manila",
  });

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
    if (updates.displayName || updates.email) setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  const [modal, setModal] = useState(null);
  const openModal  = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal(null);

  const [toasts, setToasts] = useState([]);
  const toast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, register, logout,
      products, productsLoading, productsError, addProduct, updateProduct, deleteProduct, fetchProducts,
      orders, addOrder, updateOrderStatus, deleteOrder,
      users, addUser, updateUser, deleteUser,
      settings, updateSettings,
      modal, openModal, closeModal,
      toasts, toast,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
