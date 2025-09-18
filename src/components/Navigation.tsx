'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Camera,
  TrendingUp,
  Users,
  Settings,
  Menu,
  X,
  Trees
} from 'lucide-react';

const navigationItems = [
  { href: '/dashboard', label: '홈', icon: Home },
  { href: '/ar-experience', label: 'AR 체험', icon: Camera },
  { href: '/progress', label: '진행상황', icon: TrendingUp },
  { href: '/community', label: '커뮤니티', icon: Users },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('정말 로그아웃하시겠습니까?')) {
      localStorage.clear();
      router.push('/');
    }
  };

  return (
    <>
      {/* Mobile Navigation Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-earth-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full md:w-64 bg-white border-r border-earth-200 z-40">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <Trees className="h-8 w-8 text-forest-600 mr-3" />
            <h1 className="text-xl font-bold text-forest-800">숲심</h1>
          </div>

          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'forest-gradient text-white shadow-md'
                      : 'text-earth-600 hover:bg-forest-50 hover:text-forest-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-earth-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
          >
            <Settings className="w-5 h-5 mr-3" />
            로그아웃
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
        <nav
          className={`absolute left-0 top-0 h-full w-64 bg-white transform transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center mb-8 mt-12">
              <Trees className="h-8 w-8 text-forest-600 mr-3" />
              <h1 className="text-xl font-bold text-forest-800">숲심</h1>
            </div>

            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'forest-gradient text-white shadow-md'
                        : 'text-earth-600 hover:bg-forest-50 hover:text-forest-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-earth-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
            >
              <Settings className="w-5 h-5 mr-3" />
              로그아웃
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}