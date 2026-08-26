import Dropdown from '@/Components/Dropdown';
import { Bell, ChevronDown, CircleUser, LogOut, Menu, Search } from 'lucide-react';

export default function TopNavbar({ user, title, subtitle, onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:hidden"
                >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="min-w-0 flex-1 py-3">
                    <h1 className="truncate text-lg font-semibold text-zinc-950 sm:text-xl">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-0.5 truncate text-sm text-zinc-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="hidden h-10 w-72 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 md:flex">
                    <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                    <span className="truncate">Search network assets</span>
                </div>

                <button
                    type="button"
                    className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 sm:flex"
                >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                </button>

                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-left transition hover:border-teal-200 hover:bg-teal-50"
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white">
                                <CircleUser className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="hidden min-w-0 sm:block">
                                <span className="block max-w-36 truncate text-sm font-medium text-zinc-900">
                                    {user.name}
                                </span>
                                <span className="block max-w-36 truncate text-xs text-zinc-500">
                                    {user.role}
                                </span>
                            </span>
                            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content
                        width="48"
                        contentClasses="border border-zinc-200 bg-white py-2"
                    >
                        <Dropdown.Link
                            href={route('profile.edit')}
                            className="flex items-center gap-2"
                        >
                            <CircleUser className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                            Profile
                        </Dropdown.Link>
                        <Dropdown.Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 focus:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            Log out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
