import avatarImg from '../assets/cat.jpeg';
import Button from './ui/Button';

const PostCard = () => {
  return (
    <div className="font-sans leading-tight min-h-screen bg-grey-lighter p-8">
      <div className="w-full mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <div
          className="bg-cover h-40"
          style={{
            backgroundImage: "url('src/assets/watercolor-sky-background.avif')",
          }}
        ></div>
        <div className="border-b px-4 pb-6">
          <div className="flex justify-between text-center items-center sm:text-left sm:flex">
            <div className="flex">
              <img className="h-32 w-32 rounded-full border-4 border-white -mt-16 mr-4" src={avatarImg} alt="" />
              <div className="flex py-2">
                <div>
                  <h3 className="font-bold text-2xl mb-1">Cait Genevieve</h3>
                  <div className="inline-flex text-grey-dark sm:flex items-center">New York, NY</div>
                </div>
              </div>
            </div>
            <div className="flex h-fit">
              <Button className="w-60 rounded-full ">Follow</Button>
              <Button variant="ghost" className="w-60 rounded-full">
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
