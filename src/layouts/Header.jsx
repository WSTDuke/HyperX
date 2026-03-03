import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../routes/supabaseClient";
import LazyLoading from "../page/enhancements/LazyLoading";
import NeedAuthModal from "../components/NeedAuthModal";
import { Bars3Icon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { useNotifications } from "../hooks/useNotifications";
import { useChatConversations } from "../hooks/useChatConversations";

import { NavigationLinks } from "./header/NavigationLinks";
import { SearchUsers } from "./header/SearchUsers";
import { NotificationDropdown } from "./header/NotificationDropdown";
import { MessageDropdown } from "./header/MessageDropdown";
import { UserDropdown } from "./header/UserDropdown";
import { MobileMenu } from "./header/MobileMenu";

const navigation = [
  { name: "Community", href: "community", private: true },
  { name: "Product", href: "product", private: true },
  { name: "Docs", href: "docs", private: false },
  { name: "Chatbot AI", href: "chatbot-ai", private: true },
];

const Header = ({ user }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteConvModalOpen, setDeleteConvModalOpen] = useState(false);
  const [convToDelete, setConvToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Custom Hooks
  const {
    notifications,
    unreadCount,
    hasSeenNoti,
    notiOpen,
    setNotiOpen,
    setHasSeenNoti,
    handleReadNotification,
    handleMarkAllRead,
    clearAllNotifications,
  } = useNotifications(user);

  const {
    conversations,
    msgOpen,
    setMsgOpen,
    handleOpenChat,
    deleteConversation,
  } = useChatConversations(user);

  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const confirmDeleteAllNotifications = async () => {
    setLoggingOut(true);
    await clearAllNotifications(() => closeDeleteModal());
    setLoggingOut(false);
  };

  const confirmDeleteConv = async () => {
    if (!convToDelete || !user?.id) return;
    const success = await deleteConversation(convToDelete.id);
    if (success) {
      setDeleteConvModalOpen(false);
      setConvToDelete(null);
    } else {
      alert("Failed to delete conversation");
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    setLoggingOut(true);
    navigate("/");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("sb-")) localStorage.removeItem(key);
        });
        return;
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) localStorage.removeItem(key);
      });
    } finally {
      setTimeout(() => setLoggingOut(false), 800);
    }
  };

  const headerClasses = `fixed inset-x-0 top-0 z-[10000] transition-all duration-300 border-b ${
    scrolled
      ? "bg-[#050505]/80 backdrop-blur-xl border-white/5 shadow-lg shadow-cyan-500/5"
      : "bg-transparent border-transparent"
  }`;

  const safeUserEmail = user?.email || "";
  const safeUserName = user?.user_metadata?.full_name || "User";

  return (
    <header className={headerClasses}>
      {loggingOut && <LazyLoading status={"Processing..."} />}

      <nav
        className="flex items-center justify-between py-3 px-5 lg:px-8 max-w-[90rem] mx-auto"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 items-center gap-4">
          <Link
            to={user ? "/community" : "/"}
            onClick={() => {
              if (location.pathname === "/community") {
                window.dispatchEvent(
                  new CustomEvent("hyperx-refresh-community")
                );
              }
            }}
            className="-m-1.5 p-1.5 group flex items-center gap-2"
          >
            <span className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 group-hover:to-white transition-all duration-300">
              HYPER<span className="text-cyan-400">X</span>
            </span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-white transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="w-7 h-7" aria-hidden="true" />
          </button>
        </div>

        <NavigationLinks
          navigation={navigation}
          user={user}
          setIsAuthModalOpen={setIsAuthModalOpen}
        />

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-5 relative">
          {user ? (
            <>
              <SearchUsers />

              <MessageDropdown
                user={user}
                conversations={conversations}
                msgOpen={msgOpen}
                setMsgOpen={setMsgOpen}
                handleOpenChat={handleOpenChat}
                deleteConvModalOpen={deleteConvModalOpen}
                setDeleteConvModalOpen={setDeleteConvModalOpen}
                setConvToDelete={setConvToDelete}
              />

              {deleteConvModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#0B0D14] border border-white/10 p-6 shadow-2xl ring-1 ring-white/5 animate-in zoom-in-95 duration-200 relative">
                    <button
                      onClick={() => setDeleteConvModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                    <h3 className="text-lg font-bold text-white uppercase mb-4 text-center">
                      Delete Conversation?
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 text-center py-6 font-semibold border-t border-white/10">
                      Delete the entire conversation? This can’t be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConvModalOpen(false)}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-400 text-xs font-bold uppercase hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDeleteConv}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
                      >
                        Delete All
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                hasSeenNoti={hasSeenNoti}
                notiOpen={notiOpen}
                setNotiOpen={setNotiOpen}
                setHasSeenNoti={setHasSeenNoti}
                handleReadNotification={handleReadNotification}
                handleMarkAllRead={handleMarkAllRead}
                openDeleteModal={openDeleteModal}
              />

              <UserDropdown
                user={user}
                safeUserName={safeUserName}
                safeUserEmail={safeUserEmail}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                handleLogout={handleLogout}
              />
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="group px-4 py-5 flex items-center gap-2 text-[15px] font-bold text-gray-400 hover:text-cyan-400 transition-all duration-300"
              >
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="relative group px-8 py-3.5 flex items-center gap-2 overflow-hidden rounded-full bg-cyan-500 text-black text-sm font-black uppercase tracking-tighter hover:bg-white hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all duration-500"
              >
                <span>Sign Up</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
            </>
          )}
        </div>
      </nav>

      <MobileMenu
        user={user}
        safeUserEmail={safeUserEmail}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        navigation={navigation}
        setIsAuthModalOpen={setIsAuthModalOpen}
        handleLogout={handleLogout}
      />

      <Transition show={isDeleteModalOpen}>
        <Dialog as="div" className="relative z-[100]" onClose={closeDeleteModal}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-[#0B0D14] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-white/10 ring-1 ring-white/5">
                  <div className="bg-[#0B0D14] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-lg font-bold leading-6 text-white">
                          Delete Notifications
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-400">
                            Are you sure you want to clear all notifications? This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0B0D14]/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-white/5">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto transition-colors"
                      onClick={confirmDeleteAllNotifications}
                    >
                      Delete All
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 sm:mt-0 sm:w-auto transition-colors"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <NeedAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Header;
