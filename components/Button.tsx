export interface ButtonProps {
  className?: string;
  text: string;
  onClick: any;
}

const Button: React.FC<ButtonProps> = ({ className, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${className} w-16 bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 border-b-4 border-gray-500 hover:border-gray-400 rounded`}
    >
      {text}
    </button>
  );
};

export default Button;
