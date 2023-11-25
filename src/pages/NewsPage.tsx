import NavBar from '../components/NavBar';
import NewsPostContaiener from '../components/NewsPostContaiener';
import SideBar from '../components/SideBar';

const NewsPage = () => {
  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="flex pt-16">
        <div className="flex-grow overflow-y-auto ">
          <NewsPostContaiener />
        </div>
        <SideBar />
      </div>
    </div>
  );
};

export default NewsPage;
