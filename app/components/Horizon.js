export default function Horizon({ icon: Icon, label, time }) {
  return (
    <div className="flex flex-row items-center gap-x-2 text-sm md:text-md">
      <Icon size={28} />
      <h2 className="font-light">{label}</h2>
      <h2>{time}</h2>
    </div>
  );
}
