import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const navigation = [
    { name: "Browse Properties", href: "/", icon: "Home" },
    { name: "Map View", href: "/map", icon: "Map" },
    { name: "Saved Properties", href: "/saved", icon: "Heart" },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Home" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HomeView
            </span>
          </Link>

{/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                {item.name}
              </Link>
            ))}
            {/* User Section */}
            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.firstName || user?.name || 'User'}
                </span>
                <Button
                  onClick={logout}
                  variant="ghost"
                  icon="LogOut"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-gray-100"
            >
<nav className="py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <ApperIcon name={item.icon} size={20} />
                    {item.name}
                  </Link>
                ))}
                {/* Mobile User Section */}
                {isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-600 mb-2">
                      Welcome, {user?.firstName || user?.name || 'User'}
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-red-600 hover:bg-red-50"
                    >
                      <ApperIcon name="LogOut" size={20} />
                      Logout
                    </button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;