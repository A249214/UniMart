import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from '@/context/ToastContext'
import { CampusProvider } from '@/context/CampusContext'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// Pages
import { HomePage } from '@/pages/HomePage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductDetailsPage } from '@/pages/ProductDetailsPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { MyOrdersPage } from '@/pages/MyOrdersPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <CampusProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  
                  {/* Public Authentication routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Student Portal routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<MyOrdersPage />} />
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </CampusProvider>
    </ToastProvider>
  )
}

export default App
