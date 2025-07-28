import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  NavbarMenu, NavbarMenuItem, NavbarMenuToggle,
  Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from '@nextui-org/react';
import { BookDashed, LogOut, Plus } from 'lucide-react';
import logo from '../assets/logo.png';

// --- Type Definitions ---
interface UserProfile {
  name: string;
  avatar?: string;
}

interface NavBarProps {
  isAuthenticated: boolean;
  userProfile?: UserProfile;
  onLogout: () => void;
}

interface NavLinkItemProps {
  path: string;
  name: string;
  isActive: boolean;
}

// --- Sub-Components for Clarity ---

/**
 * Renders a single navigation link with active state styling.
 */
const NavLinkItem: React.FC<NavLinkItemProps> = ({ path, name, isActive }) => (
  <NavbarItem isActive={isActive}>
    <Link
      to={path}
      className={`
        pb-1.5 text-base transition-colors hover:text-white border-b-2
        ${isActive ? 'text-white font-semibold border-white' : 'text-white/70 border-transparent'}
      `}
    >
      {name}
    </Link>
  </NavbarItem>
);

/**
 * Renders the user avatar and dropdown menu for authenticated users.
 */
const AuthenticatedUserMenu: React.FC<{ userProfile?: UserProfile; onLogout: () => void }> = ({ userProfile, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform text-white font-semibold" 
          src={userProfile?.avatar}
          name={userProfile?.name?.charAt(0)}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" onAction={(key) => navigate(key as string)}>
        <DropdownItem key="/posts/new" startContent={<Plus size={16} />}>
          New Post
        </DropdownItem>
        <DropdownItem key="/posts/drafts" startContent={<BookDashed size={16} />}>
          Drafts
        </DropdownItem>
        <DropdownItem key="/" startContent={<LogOut size={16} />} className="text-danger" color="danger" onPress={onLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

/**
 * Renders the "Log In" and "Sign Up" buttons for unauthenticated users.
 */
const UnauthenticatedButtons = () => (
  <>
    <NavbarItem>
        <Button as={Link} to="/login" variant="bordered" className="text-white border-white/50 hover:bg-white/10 rounded-lg text-base">
        Log In
      </Button>
    </NavbarItem>
    <NavbarItem>
      <Button as={Link} to="/register" className="bg-orange-500 text-white font-semibold rounded-lg text-base px-5">
        Sign Up
      </Button>
    </NavbarItem>
  </>
);


// --- Main NavBar Component ---

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, userProfile, onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Tags', path: '/tags' },
  ];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-blue-600 text-white shadow-none pt-4"
      classNames={{ wrapper: "max-w-7xl px-4" }}
    >
      {/* Mobile: Brand */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarBrand>
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="FIT Logo" 
              className="h-24 w-auto object-contain"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Mobile: Menu Toggle */}
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-white"
        />
      </NavbarContent>

      {/* Desktop: Brand */}
      <NavbarContent className="hidden sm:flex" justify="start">
        <NavbarBrand>
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="FIT Logo" 
              className="h-28 w-auto object-contain"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

{/* Desktop: Nav Links */}
<NavbarContent className="hidden sm:flex gap-8" justify="center">
  {menuItems.map((item) => (
    <NavLinkItem key={item.path} {...item} isActive={location.pathname === item.path} />
  ))}
</NavbarContent>

{/* Desktop: Auth Section */}
<NavbarContent className="hidden sm:flex" justify="end">
  {isAuthenticated 
    ? <AuthenticatedUserMenu userProfile={userProfile} onLogout={onLogout} />
    : <UnauthenticatedButtons />
  }
</NavbarContent>


      {/* Mobile Menu Content */}
      <NavbarMenu className="bg-blue-600/95 pt-4">
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.path}>
            <Link
              to={item.path}
              className={`w-full text-lg ${location.pathname === item.path ? 'text-white font-semibold' : 'text-white/70'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        
        {isAuthenticated ? (
          <div className="flex flex-col gap-4 mt-6">
            <Button 
              as={Link} 
              to="/posts/new" 
              variant="flat" 
              className="bg-white/10 text-white font-semibold justify-start" 
              startContent={<Plus size={16} />}
              onClick={() => setIsMenuOpen(false)}
            >
              New Post
            </Button>
            <Button 
              as={Link} 
              to="/posts/drafts" 
              variant="flat" 
              className="bg-white/10 text-white font-semibold justify-start" 
              startContent={<BookDashed size={16} />}
              onClick={() => setIsMenuOpen(false)}
            >
              Drafts
            </Button>
            <Button 
              variant="flat" 
              className="bg-red-500/20 text-red-200 font-semibold justify-start" 
              startContent={<LogOut size={16} />}
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
            >
              Log Out
            </Button>
          </div>
        ) : (
           <div className="flex flex-col gap-4 mt-6">
              <Button as={Link} to="/login" variant="flat" className="bg-white/10 text-white font-semibold" onClick={() => setIsMenuOpen(false)}>
                  Log In
              </Button>
              <Button as={Link} to="/register" className="bg-orange-500 text-white font-semibold" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
              </Button>
           </div>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;