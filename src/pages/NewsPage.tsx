import { useState } from 'react';
import NavBar from '../components/Other/NavBar';
import NewsPostContaiener from '../components/Post/NewsPostContaiener';
import SideBar from '../components/SideBar/SideBar';

const NewsPage = () => {
  const [isSideBarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="container mx-auto">
      <NavBar openSidebar={openSidebar} />
      <div className="flex pt-16">
        <div className="flex-grow overflow-y-auto ">
          <NewsPostContaiener />
        </div>
        <SideBar isSideBarOpen={isSideBarOpen} closeSidebar={closeSidebar} />
      </div>
    </div>
  );
};

export default NewsPage;
