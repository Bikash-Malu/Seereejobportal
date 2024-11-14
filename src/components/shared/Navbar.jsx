import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog"; // Import Dialog components

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to control profile modal
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false); // State for logout dialog

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openProfileModal = () => setIsProfileOpen(true); // Open modal function
  const closeProfileModal = () => setIsProfileOpen(false); // Close modal function

  return (
    <div className="bg-white mt-2">
      <div className="flex items-center justify-between px-4 mx-auto max-w-7xl h-16">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src="/logo-seeree.png" alt="Logo" width={150} />
        </div>

        {/* Desktop Menu Items */}
        <div className="hidden md:flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
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
                <Button className="bg-blue-600 hover:bg-blue-500">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto||'https://i.pinimg.com/564x/94/c6/25/94c62511d312b8612aa0ab92318966f2.jpg'}
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div>
                  <div className="flex gap-2 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="@shadcn"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    {user && user.role === "student" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <User2 />
                        <Button variant="link">
                          <Link to="/profile">View Profile</Link>
                        </Button>
                      </div>
                    )}
                    {user && user.role === "recruiter" && (
                      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                        <DialogTrigger asChild>
                          <div className="flex w-fit items-center gap-2 cursor-pointer">
                            <User2 />
                            <Button variant="link" onClick={openProfileModal}>
                              View Profile
                            </Button>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Recruiter Profile</DialogTitle>
                          </DialogHeader>
                          <div className="flex justify-center mt-4">
                            <Avatar className="w-32 h-32">
                              <AvatarImage
                                src={user?.profile?.profilePhoto}
                                alt={`${user?.fullname}'s Profile Photo`}
                              />
                            </Avatar>
                          </div>
                          <div className="p-4">
                            <div className="text-center mt-4">
                              <h2 className="text-lg font-semibold">{user?.fullname}</h2>
                              <p className="text-sm text-muted-foreground">
                                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                              </p>
                            </div>
                            <div className="mt-4 space-y-2 text-center">
                              <p><strong>Email:</strong> {user?.email}</p>
                              <p><strong>Bio:</strong> {user?.profile?.bio || "Experienced recruiter skilled in talent acquisition and employee engagement."}</p>
                              <p><strong>PhoneNumber:</strong> {user?.phoneNumber || "No bio available"}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut />
                      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="link" onClick={() => setIsLogoutDialogOpen(true)}>
                            Logout
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Logout</DialogTitle>
                          </DialogHeader>
                          <div className="p-4 text-center">
                            <p>Are you sure you want to logout?</p>
                            <DialogFooter className="flex justify-center gap-4 mt-4">
                              <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={logoutHandler}>Confirm</Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
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
            {user && user.role === "recruiter" ? (
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
                    <Button className="bg-blue-600 hover:bg-blue-500">
                      Signup
                    </Button>
                  </Link>
                </li>
              </>
            ) : (
              <div className="flex flex-col my-2 text-gray-600">
                {user && user.role === "student" && (
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <User2 />
                    <Button variant="link">
                      <Link to="/profile">View Profile</Link>
                    </Button>
                  </div>
                )}
                <div className="flex w-fit items-center gap-2 cursor-pointer">
                  <LogOut />
                  <Button variant="link" onClick={() => setIsLogoutDialogOpen(true)}>
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
