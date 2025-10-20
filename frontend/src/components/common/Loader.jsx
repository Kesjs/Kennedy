import { RotatingLines } from 'react-loader-spinner';

const Loader = ({ size = 'md', color = '#6A0DAD' }) => {
  const sizeMap = {
    sm: 24,
    md: 48,
    lg: 64,
  };

  return (
    <div className="flex justify-center items-center">
      <RotatingLines
        strokeColor={color}
        strokeWidth="5"
        animationDuration="0.75"
        width={sizeMap[size]}
        visible={true}
      />
    </div>
  );
};

export default Loader;
