// ─── AppContext.jsx ────────────────────────────────────────────────────────────
// Global state management using React Context.
// Auth now hits the Laravel API. Products are fetched from / saved to MySQL.

import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
