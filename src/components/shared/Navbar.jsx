
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Menu } from 'lucide-react'; // Use Lucide-react for the Menu icon
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage the menu visibility

    const logoutHandler = async () => {
        try {
            // Make API call to log out
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                // Remove the specific cookie named 'token'
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                
                // Clear user state and navigate
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between px-4 mx-auto max-w-7xl h-16">
                {/* Logo Section */}
                <div className="flex items-center">
                    <img src="/logo-seeree.png" alt="Logo" width={150} />
                </div>

                {/* Desktop Menu Items */}
                <div className="hidden md:flex items-center gap-12">
                    <ul className="flex font-medium items-center gap-5">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link to="/admin/companies">Companies</Link>
                                </li>
                                <li>
                                    <Link to="/admin/jobs">Jobs</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/jobs">Jobs</Link>
                                </li>
                                <li>
                                    <Link to="/browse">Browse</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Auth Buttons or User Profile */}
                <div className="flex items-center gap-4">
                    {!user ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-blue-600 hover:bg-blue-500">Signup</Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div>
                                    <div className="flex gap-2 space-y-2">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium">{user?.fullname}</h4>
                                            <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col my-2 text-gray-600">
                                        {user && user.role === 'student' && (
                                            <div className="flex w-fit items-center gap-2 cursor-pointer">
                                                <User2 />
                                                <Button variant="link">
                                                    <Link to="/profile">View Profile</Link>
                                                </Button>
                                            </div>
                                        )}
                                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    {/* Hamburger Menu for Mobile */}
                    <button
                        onClick={toggleMenu}
                        className="flex md:hidden p-2 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <ul className="flex flex-col items-start gap-4 p-4">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link to="/admin/companies">Companies</Link>
                                </li>
                                <li>
                                    <Link to="/admin/jobs">Jobs</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/jobs">Jobs</Link>
                                </li>
                                <li>
                                    <Link to="/browse">Browse</Link>
                                </li>
                            </>
                        )}
                        {!user ? (
                            <>
                                <li>
                                    <Link to="/login">
                                        <Button variant="outline">Login</Button>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup">
                                        <Button className="bg-blue-600 hover:bg-blue-500">Signup</Button>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <div className="flex flex-col my-2 text-gray-600">
                                {user && user.role === 'student' && (
                                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                                        <User2 />
                                        <Button variant="link">
                                            <Link to="/profile">View Profile</Link>
                                        </Button>
                                    </div>
                                )}
                                <div className="flex w-fit items-center gap-2 cursor-pointer">
                                    <LogOut />
                                    <Button onClick={logoutHandler} variant="link">
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
