import { IconType } from "react-icons";

interface ThermometerProps {
  icon: IconType;
  property: string;
  calculation: string;
}

export default function Thermometer({ icon: Icon, property, calculation }: ThermometerProps) {
  return (
    <div className="flex font-light text-sm items-center justify-center">
      <Icon size={18} className="mr-1"/>
      <p>{property}: <span className="font-semibold">{calculation}</span></p>
    </div>
  );
}
