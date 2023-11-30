interface DeleteModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: 'post' | 'comment' | 'message' | 'accaunt';
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isModalOpen, onClose, onConfirm, item }) => {
  return (
    <div className={`fixed inset-0 z-30 ${isModalOpen ? 'flex items-center justify-center' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-500 opacity-50" onClick={onClose}></div>
      <div className="z-10 rounded bg-white p-6 shadow-lg">
        <p className="mb-4 text-lg font-bold">Are you sure you want to delete this {item}?</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onConfirm} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
            Yes, Delete
          </button>
          <button onClick={onClose} className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
