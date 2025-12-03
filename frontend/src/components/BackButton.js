import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      {/* Desktop Back Button */}
      <Button
        onClick={handleBack}
        variant="outline"
        size="sm"
        className="hidden md:block fixed top-20 left-6 z-40 bg-white/80 backdrop-blur border-[#006847] text-[#006847] hover:bg-white shadow-lg"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
      
      {/* Mobile Back Button - Centered Top */}
      <Button
        onClick={handleBack}
        variant="outline"
        size="sm"
        className="md:hidden fixed top-16 left-1/2 transform -translate-x-1/2 z-40 bg-white/60 backdrop-blur-md border-[#006847]/50 text-[#006847] hover:bg-white/80 shadow-md px-3 py-1 text-xs"
      >
        <ArrowLeft className="h-3 w-3 mr-1" />
        Back
      </Button>
    </>
  );
}

export default BackButton;
