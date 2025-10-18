import WinnerNumberUpload from '../features/admin/WinnerNumberUpload';

const WinnerNumberUploadPage = () => {
  // Always allow upload for now
  return (
    <div className="max-w-7xl mx-auto pt-10 not-first-of-type:rounded-2xl ">
      <WinnerNumberUpload isAdmin={true} />
    </div>
  );
};

export default WinnerNumberUploadPage;
