import Button from './ui/Button';

type ProfileCardProps = {
  imageSrc: string;
  name: string;
  status: string;
  isCurrentUser: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileCard = ({ imageSrc, name, status, isCurrentUser, setEdit }: ProfileCardProps) => {
  return (
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
            <img className="h-40 w-40 rounded-full border-4 border-white -mt-16 mr-4" src={imageSrc} alt="avatar" />
            <div className="flex flex-col py-4">
              <h3 className="font-bold md:text-2xl text-base mb-1 text-left">{name}</h3>
              <div className="inline-flex text-grey-dark sm:flex md:text-base text-sm items-center text-left">{status}</div>
            </div>
          </div>
          <div className="flex h-fit md:flex-row flex-col">
            {!isCurrentUser ? (
              <>
                <Button className="md:w-40 w-24 rounded-full">Follow</Button>
                <Button variant="ghost" className="w-40 rounded-full">
                  Message
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="md:w-40 w-24 rounded-full"
                onClick={() => setEdit((prev) => !prev)}
                disabled={!isCurrentUser}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
