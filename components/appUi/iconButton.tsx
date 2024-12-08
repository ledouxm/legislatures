type Props = {
  Icon: React.ElementType;
  label: string;
  onClick: () => void;
};

export default function IconButton({ Icon, label, onClick }: Props) {
  return (
    <div className="bg-white rounded-full">
      <button
        aria-label={label}
        className="size-9 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center cursor-pointer text-black/50 hover:text-black transition-all flex-shrink-0"
        onClick={onClick}
      >
        <Icon className="size-4" />
      </button>
    </div>
  );
}
