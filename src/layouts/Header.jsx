import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react' // <--- IMPORT useEffect
import { Link } from 'react-router-dom'


const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Docs', href: '#' },
    { name: 'Support', href: '#' },
]

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    // 1. STATE để lưu trạng thái cuộn
    const [scrolled, setScrolled] = useState(false);

    // 2. EFFECT để lắng nghe sự kiện cuộn
    useEffect(() => {
        const handleScroll = () => {
            // Kiểm tra nếu vị trí cuộn Y lớn hơn 50px
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        // Thêm Listener cho sự kiện cuộn
        window.addEventListener('scroll', handleScroll);

        // Cleanup function: Loại bỏ Listener khi component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Chỉ chạy một lần khi component mount

    // 3. TẠO LỚP CSS ĐỘNG
    const headerClasses = `
        fixed inset-x-0 top-0 z-50 transition-all duration-300 backdrop-blur-md 
        ${scrolled ? 'bg-gray-900/90 shadow-lg' : 'bg-transparent'}
    `;

    return (
        // 4. Áp dụng lớp CSS động
        <header className={headerClasses}>
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                {/* ... (Phần còn lại của code navigation không thay đổi) ... */}
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-500 bg-clip-text text-transparent">
                            HyperX
                        </span>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white">
                            {item.name}
                        </a>
                    ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link to="/signup" className="text-sm/6 font-semibold text-white border-r mr-8 pr-8">
                        Sign up
                    </Link>
                    <Link to="/signin" className="text-sm/6 font-semibold text-white">
                        Sign in <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-500 bg-clip-text text-transparent">
                                HyperX
                            </span>
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-200"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-white/10">
                            <div className="space-y-2 py-6">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <div className="py-6">
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                                >
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}

export default Header