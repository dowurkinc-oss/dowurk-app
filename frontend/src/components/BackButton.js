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
    <Button
      onClick={handleBack}
      variant="outline"
      size="sm"
      className="fixed top-20 left-6 z-40 bg-white/80 backdrop-blur border-[#006847] text-[#006847] hover:bg-white shadow-lg"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Back
    </Button>
  );
}

export default BackButton;
