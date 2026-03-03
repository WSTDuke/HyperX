import {
  Dialog,
  DialogPanel,
} from "@headlessui/react";
import { Link } from "react-router-dom";
import { XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import UserAvatar from "../../components/UserAvatar";

export const MobileMenu = ({
  user,
  safeUserEmail,
  mobileMenuOpen,
  setMobileMenuOpen,
  navigation,
  setIsAuthModalOpen,
  handleLogout
}) => {
  return (
    <Dialog
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
      className="lg:hidden"
    >
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
      <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#050505] p-6 sm:max-w-sm border-l border-white/10 shadow-2xl">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="-m-1.5 p-1.5 flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-indigo-500">
              HYPER<span className="text-cyan-400">X</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-white"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-8 flow-root">
          <div className="-my-6 divide-y divide-white/10">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10"
                  onClick={(e) => {
                    if (!user && item.private) {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    } else {
                      setMobileMenuOpen(false);
                    }
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6">
              {user ? (
                <div className="flex flex-col gap-4">
                  <Link
                    to={`/profile/${user?.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 -mx-3 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <UserAvatar
                      user={user}
                      size="sm"
                      disableLink={true}
                      className="border border-cyan-500"
                    />
                    <div>
                      <div className="text-white font-medium">Profile</div>
                      <div className="text-xs text-gray-500">
                        {safeUserEmail}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-red-600/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-600/30 flex items-center justify-center gap-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    to="/signin"
                    className="w-full flex items-center justify-center gap-3 rounded-2xl px-3 py-3.5 text-base font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:text-cyan-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" /> Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center gap-3 rounded-2xl px-3 py-3.5 text-base font-black text-black bg-cyan-500 hover:bg-white shadow-[0_10px_30px_rgba(6,182,212,0.3)] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlusIcon className="w-5 h-5" /> Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};
