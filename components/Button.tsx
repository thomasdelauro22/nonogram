export interface ButtonProps {
  className?: string;
  text: string;
  onClick: any;
}

const Button: React.FC<ButtonProps> = ({ className, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${className} bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded`}
    >
      {text}
    </button>
  );
};

export default Button;
